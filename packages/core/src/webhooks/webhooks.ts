import { validateEvent } from "@polar-sh/sdk/webhooks";
import type {
  WebhookCheckoutCreatedPayload,
  WebhookCheckoutUpdatedPayload,
  WebhookOrderCreatedPayload,
  WebhookSubscriptionCreatedPayload,
  WebhookSubscriptionUpdatedPayload,
  WebhookSubscriptionActivePayload,
  WebhookSubscriptionCanceledPayload,
  WebhookSubscriptionRevokedPayload,
  WebhookProductCreatedPayload,
  WebhookProductUpdatedPayload,
  WebhookOrganizationUpdatedPayload,
  WebhookBenefitCreatedPayload,
  WebhookBenefitUpdatedPayload,
  WebhookBenefitGrantCreatedPayload,
  WebhookBenefitGrantUpdatedPayload,
  WebhookBenefitGrantRevokedPayload,
} from "@polar-sh/sdk/models/components";

export interface WebhooksConfig {
  webhookSecret: string;
  onPayload?: (payload: ReturnType<typeof validateEvent>) => Promise<void>;
  onCheckoutCreated?: (payload: WebhookCheckoutCreatedPayload) => Promise<void>;
  onCheckoutUpdated?: (payload: WebhookCheckoutUpdatedPayload) => Promise<void>;
  onOrderCreated?: (payload: WebhookOrderCreatedPayload) => Promise<void>;
  onSubscriptionCreated?: (
    payload: WebhookSubscriptionCreatedPayload,
  ) => Promise<void>;
  onSubscriptionUpdated?: (
    payload: WebhookSubscriptionUpdatedPayload,
  ) => Promise<void>;
  onSubscriptionActive?: (
    payload: WebhookSubscriptionActivePayload,
  ) => Promise<void>;
  onSubscriptionCanceled?: (
    payload: WebhookSubscriptionCanceledPayload,
  ) => Promise<void>;
  onSubscriptionRevoked?: (
    payload: WebhookSubscriptionRevokedPayload,
  ) => Promise<void>;
  onProductCreated?: (payload: WebhookProductCreatedPayload) => Promise<void>;
  onProductUpdated?: (payload: WebhookProductUpdatedPayload) => Promise<void>;
  onOrganizationUpdated?: (
    payload: WebhookOrganizationUpdatedPayload,
  ) => Promise<void>;
  onBenefitCreated?: (payload: WebhookBenefitCreatedPayload) => Promise<void>;
  onBenefitUpdated?: (payload: WebhookBenefitUpdatedPayload) => Promise<void>;
  onBenefitGrantCreated?: (
    payload: WebhookBenefitGrantCreatedPayload,
  ) => Promise<void>;
  onBenefitGrantUpdated?: (
    payload: WebhookBenefitGrantUpdatedPayload,
  ) => Promise<void>;
  onBenefitGrantRevoked?: (
    payload: WebhookBenefitGrantRevokedPayload,
  ) => Promise<void>;
}

export const handleWebhookPayload = async (
  payload: ReturnType<typeof validateEvent>,
  { webhookSecret, onPayload, ...eventHandlers }: WebhooksConfig,
) => {
  onPayload?.(payload);

  switch (payload.type) {
    case "checkout.created":
      eventHandlers.onCheckoutCreated?.(payload);
      break;
    case "checkout.updated":
      eventHandlers.onCheckoutUpdated?.(payload);
      break;
    case "order.created":
      eventHandlers.onOrderCreated?.(payload);
      break;
    case "subscription.created":
      eventHandlers.onSubscriptionCreated?.(payload);
      break;
    case "subscription.updated":
      eventHandlers.onSubscriptionUpdated?.(payload);
      break;
    case "subscription.active":
      eventHandlers.onSubscriptionActive?.(payload);
      break;
    case "subscription.canceled":
      eventHandlers.onSubscriptionCanceled?.(payload);
      break;
    case "subscription.revoked":
      eventHandlers.onSubscriptionRevoked?.(payload);
      break;
    case "product.created":
      eventHandlers.onProductCreated?.(payload);
      break;
    case "product.updated":
      eventHandlers.onProductUpdated?.(payload);
      break;
    case "organization.updated":
      eventHandlers.onOrganizationUpdated?.(payload);
      break;
    case "benefit.created":
      eventHandlers.onBenefitCreated?.(payload);
      break;
    case "benefit.updated":
      eventHandlers.onBenefitUpdated?.(payload);
      break;
    case "benefit_grant.created":
      eventHandlers.onBenefitGrantCreated?.(payload);
      break;
    case "benefit_grant.updated":
      eventHandlers.onBenefitGrantUpdated?.(payload);
      break;
    case "benefit_grant.revoked":
      eventHandlers.onBenefitGrantRevoked?.(payload);
      break;
  }
};
