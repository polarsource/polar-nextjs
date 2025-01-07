import { Polar } from "@polar-sh/sdk";
import {
	WebhookVerificationError,
	validateEvent,
} from "@polar-sh/sdk/webhooks";
import { type NextRequest, NextResponse } from "next/server";

export interface CheckoutConfig {
	accessToken?: string;
	successUrl?: string;
	includeCheckoutId?: boolean;
	server?: "sandbox" | "production";
}

export const Checkout = ({
	accessToken,
	successUrl,
	server,
	includeCheckoutId = true,
}: CheckoutConfig) => {
	const polar = new Polar({
		accessToken,
		server,
	});

	return async (req: NextRequest) => {
		const url = new URL(req.url);
		const productId = url.searchParams.get("productId");

		if (!productId) {
			return NextResponse.json(
				{ error: "Missing productId in query params" },
				{ status: 400 },
			);
		}

		const success = successUrl ? new URL(successUrl) : undefined;

		if (success && includeCheckoutId) {
			success.searchParams.set("checkoutId", "{CHECKOUT_ID}");
		}

		try {
			const result = await polar.checkouts.custom.create({
				productId,
				successUrl: success?.toString(),
				customerId: url.searchParams.get("customerId") ?? undefined,
				customerEmail: url.searchParams.get("customerEmail") ?? undefined,
				customerName: url.searchParams.get("customerName") ?? undefined,
				customerBillingAddress: url.searchParams.has("customerBillingAddress")
					? JSON.parse(url.searchParams.get("customerBillingAddress") ?? "{}")
					: undefined,
				customerTaxId: url.searchParams.get("customerTaxId") ?? undefined,
				customerIpAddress:
					url.searchParams.get("customerIpAddress") ?? undefined,
				customerMetadata: url.searchParams.has("customerMetadata")
					? JSON.parse(url.searchParams.get("customerMetadata") ?? "{}")
					: undefined,
				allowDiscountCodes: url.searchParams.has("allowDiscountCodes")
					? url.searchParams.get("allowDiscountCodes") === "true"
					: undefined,
				discountId: url.searchParams.get("discountId") ?? undefined,
				metadata: url.searchParams.has("metadata")
					? JSON.parse(url.searchParams.get("metadata") ?? "{}")
					: undefined,
			});

			return NextResponse.redirect(result.url);
		} catch (error) {
			console.error(error);
			return NextResponse.error();
		}
	};
};

export interface CustomerPortalConfig {
	accessToken: string;
	server: "sandbox" | "production";
}

export const CustomerPortal = ({
	accessToken,
	server,
}: CustomerPortalConfig) => {
	const polar = new Polar({
		accessToken,
		server,
	});

	return async (req: NextRequest) => {
		const url = new URL(req.url);
		const customerId = url.searchParams.get("customerId");

		if (!customerId) {
			return NextResponse.json(
				{ error: "Missing customerId in query params" },
				{ status: 400 },
			);
		}

		try {
			const result = await polar.customerSessions.create({
				customerId,
			});

			return NextResponse.redirect(result.customerPortalUrl);
		} catch (error) {
			console.error(error);
			return NextResponse.error();
		}
	};
};

export interface WebhooksConfig {
	webhookSecret: string;
	onPayload: (payload: ReturnType<typeof validateEvent>) => Promise<void>;
}

export const Webhooks = ({ webhookSecret, onPayload }: WebhooksConfig) => {
	return async (request: NextRequest) => {
		const requestBody = await request.text();

		const webhookHeaders = {
			"webhook-id": request.headers.get("webhook-id") ?? "",
			"webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
			"webhook-signature": request.headers.get("webhook-signature") ?? "",
		};

		let webhookPayload: ReturnType<typeof validateEvent>;
		try {
			webhookPayload = validateEvent(
				requestBody,
				webhookHeaders,
				webhookSecret,
			);
		} catch (error) {
			if (error instanceof WebhookVerificationError) {
				return NextResponse.json({ received: false }, { status: 403 });
			}

			throw error;
		}

		await onPayload(webhookPayload);

		return NextResponse.json({ received: true });
	};
};
