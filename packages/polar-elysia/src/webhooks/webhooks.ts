import {
	WebhookVerificationError,
	validateEvent,
} from "@polar-sh/sdk/webhooks";
import { InlineHandler } from "elysia/dist/types";
import { Context } from "elysia";

export interface WebhooksConfig {
	webhookSecret: string;
	onPayload: (payload: ReturnType<typeof validateEvent>) => Promise<void>;
}

export const Webhooks = ({
	webhookSecret,
	onPayload,
}: WebhooksConfig): InlineHandler => {
	return async (ctx: Context) => {
		const requestBody = await ctx.request.text();

		const webhookHeaders: Record<string, string> = {
			"webhook-id": ctx.request.headers.get("webhook-id") ?? "",
			"webhook-timestamp": ctx.request.headers.get("webhook-timestamp") ?? "",
			"webhook-signature": ctx.request.headers.get("webhook-signature") ?? "",
		};

		let webhookPayload: ReturnType<typeof validateEvent>;
		try {
			webhookPayload = validateEvent(
				requestBody,
				webhookHeaders,
				webhookSecret,
			);
		} catch (error) {
			console.log(error);
			if (error instanceof WebhookVerificationError) {
				return ctx.error(400, { received: false });
			}

			return ctx.error(500, { error: "Internal server error" });
		}

		await onPayload(webhookPayload);

		return { received: true }
	};
};
