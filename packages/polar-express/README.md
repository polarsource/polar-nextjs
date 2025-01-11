# @polar-sh/express

Payments and Checkouts made dead simple with Express.

`pnpm install @polar-sh/express`

## Checkout

Create a Checkout handler which takes care of redirections.

```typescript
import { Express } from 'express'
import { Checkout } from "@polar-sh/express";

const app = new Express();

app.get('/checkout', Checkout({
  successUrl: process.env.SUCCESS_URL,
  server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
}));
```

### Query Params

Pass query params to this route.

- productId (required) `?productId=xxx`
- customerId (optional) `?productId=xxx&customerId=xxx`
- customerEmail (optional) `?productId=xxx&customerEmail=janedoe@gmail.com`
- customerName (optional) `?productId=xxx&customerName=Jane`

## Customer Portal

Create a customer portal where your customer can view orders and subscriptions.

```typescript
import { Express } from 'express'
import { CustomerPortal } from "@polar-sh/express";

const app = new Express()

app.get('/portal', CustomerPortal({
  getCustomerId: (event) => "", // Fuction to resolve a Polar Customer ID
  server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
}))
```

## Webhooks

A simple utility which resolves incoming webhook payloads by signing the webhook secret properly.

```typescript
import { Express } from 'express'
import { Webhooks } from "@polar-sh/express";

const app = new Express()

app.post('/polar/webhooks', Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => /** Handle payload */,
}))
```
