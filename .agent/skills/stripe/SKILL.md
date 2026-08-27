---
name: stripe-best-practices
description: >-
  Guidelines for working with the Stripe payment integration in this project. Use when modifying or reviewing the StripeStrategy, payment webhooks, or CQRS payment handlers.
---

# Stripe Integration Guidelines (Tailored for first-p-nestjs)

This project implements Stripe as part of a multi-gateway **Strategy Pattern** (alongside Momo and VNPay) managed via **CQRS**.

## 1. Architecture & Strategy Pattern
- **Payment Strategy**: The Stripe implementation MUST adhere to the `PaymentStrategy` interface (`src/modules/payment/interface/payment-strategy.interface.ts`).
- **CQRS Handlers**: Payment flows are decoupled. Payments are initiated via `CreatePaymentIntentHandler` and webhooks are processed by `ProcessPaymentWebhookHandler`.
- **Configuration**: Stripe configuration is injected dynamically via `PaymentModule.forRootAsync`.

## 2. PaymentIntents API (Required)
- While general Stripe guides often recommend "Checkout Sessions", **this project explicitly uses PaymentIntents** to support custom UI and the unified `PaymentStrategy` interface.
- `createPaymentIntent(amount, currency, metadata)` must use `stripe.paymentIntents.create({...})`.
- **CRITICAL RULE**: **Never include `payment_method_types`** when creating a PaymentIntent. Omit this parameter entirely. This enables dynamic payment methods, allowing the project owner to toggle payment methods (Cards, Wallets, etc.) directly from the Stripe Dashboard without changing code.

## 3. Webhook Handling & Security
- **Raw Body Required**: Stripe webhook signature verification (`verifyWebhook`) requires the **raw, unparsed body** (Buffer). Ensure the Nest.js webhook controller uses `@Req() req: RawBodyRequest<Request>` or proper raw body parsing. If validation fails with `SignatureVerificationError`, throw a standard NestJS `BadRequestException`.
- **Idempotency**: Webhook event processing (e.g., `PaymentSucceededHandler`) MUST be idempotent. Always check if the `transactionId` was already marked as paid in the database before updating records or triggering side-effects.
- **Target Events**: Primarily handle `payment_intent.succeeded` and `payment_intent.payment_failed`.

## 4. API Version & Best Practices
- **Client Instantiation**: Always instantiate a specific `Stripe` client instance inside the strategy: `new Stripe(secretKey, { apiVersion: '2024-06-20' })`.
- **API Keys**: In documentation or env examples, always recommend [Restricted API Keys (RAK)](https://docs.stripe.com/keys/restricted-api-keys.md) (`rk_...`) over full Secret Keys (`sk_...`) for security.

## Code Constraints for StripeStrategy
When editing `src/modules/payment/strategies/stripe.strategy.ts`:
- Ensure the `PaymentIntentResult` accurately maps Stripe's `id` to `transactionId` and includes the `clientSecret`.
- Ensure metadata passed into `createPaymentIntent` includes necessary identifiers (like `bookingId` or `userId`) to reconcile the payment inside the webhook handler.
