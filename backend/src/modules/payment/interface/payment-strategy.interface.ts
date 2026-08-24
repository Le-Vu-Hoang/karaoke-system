export interface PaymentIntentResult {
  transactionId: string;
  clientSecret?: string;
  paymentUrl?: string;
}

export interface WebhookEventData {
  object: {
    amount?: number;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export interface WebhookEventResult {
  type: string;
  data: WebhookEventData;
}

export interface PaymentStrategy {
  createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, string>,
  ): Promise<PaymentIntentResult>;

  verifyWebhook(payload: Record<string, unknown> | Buffer | unknown, signature?: string): WebhookEventResult;
}
