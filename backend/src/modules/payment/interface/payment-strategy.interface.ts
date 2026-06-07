export interface PaymentIntentResult {
	transactionId: string;
	clientSecret: string;
}

export interface PaymentStrategy {
	createPaymentIntent(
		amount: number,
		currency: string,
		metadata?: Record<string, string>,
	): Promise<PaymentIntentResult>;

	verifyWebhook(payload: Buffer, signature: string): any;
}
