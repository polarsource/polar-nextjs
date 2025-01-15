import type {
	Customer,
	WebhookBenefitGrantCreatedPayload,
	WebhookBenefitGrantRevokedPayload,
} from "@polar-sh/sdk/models/components";

type EntitlementProperties = Record<string, string>;

type EntitlementHandler = (
	payload:
		| WebhookBenefitGrantCreatedPayload
		| WebhookBenefitGrantRevokedPayload,
) => Promise<void>;

interface EntitlementContext<T extends EntitlementProperties> {
	customer: Customer;
	properties: T;
	payload:
		| WebhookBenefitGrantCreatedPayload
		| WebhookBenefitGrantRevokedPayload;
}

export class EntitlementStrategy<T extends EntitlementProperties> {
	private grantCallbacks: ((
		context: EntitlementContext<T>,
	) => Promise<void>)[] = [];
	private revokeCallbacks: ((
		context: EntitlementContext<T>,
	) => Promise<void>)[] = [];

	public grant(callback: (context: EntitlementContext<T>) => Promise<void>) {
		this.grantCallbacks.push(callback);
		return this;
	}

	public revoke(callback: (context: EntitlementContext<T>) => Promise<void>) {
		this.revokeCallbacks.push(callback);
		return this;
	}

	public async handler(slug: string): Promise<EntitlementHandler> {
		return async (
			payload:
				| WebhookBenefitGrantCreatedPayload
				| WebhookBenefitGrantRevokedPayload,
		) => {
			if (payload.data.benefit.slug === slug) {
				switch (payload.type) {
					case "benefit_grant.created":
						await Promise.all(
							this.grantCallbacks.map((callback) =>
								callback({
									customer: payload.data.customer,
									properties: payload.data.properties as T,
									payload,
								}),
							),
						);
						break;
					case "benefit_grant.revoked":
						await Promise.all(
							this.revokeCallbacks.map((callback) =>
								callback({
									customer: payload.data.customer,
									properties: payload.data.properties as T,
									payload,
								}),
							),
						);
						break;
				}
			}
		};
	}
}

export const Entitlement = <T extends EntitlementProperties>() => {
	return new EntitlementStrategy<T>();
};

interface FigmaTeamEntitlementProperties {
	[key: string]: string;
	figmaTeamId: string;
}

export const FigmaTeam = Entitlement<FigmaTeamEntitlementProperties>()
	.grant(async (context) => {
		/** figma.team.addMember(context.properties.figmaTeamId, context.customer.email) */
	})
	.revoke(async (context) => {
		/** figma.team.removeMember(context.properties.figmaTeamId, context.customer.email) */
	});
