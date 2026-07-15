export interface PaymentIntentResult {
	transactionId: string;
	clientSecret?: string;
	paymentUrl?: string;
}

export interface PaymentStrategy {
	createPaymentIntent(
		amount: number,
		currency: string,
		metadata?: Record<string, string>,
	): Promise<PaymentIntentResult>;

	verifyWebhook(payload: any, signature?: string): any;
}
