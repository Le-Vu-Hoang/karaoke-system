import { Injectable, Logger } from '@nestjs/common';
import { PaymentIntentResult, PaymentStrategy } from '../interface/payment-strategy.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeStrategy implements PaymentStrategy {
	private readonly stripe: InstanceType<typeof Stripe>;
	private readonly logger = new Logger(StripeStrategy.name);

	constructor(
		private readonly secretKey: string,
		private readonly webhookSecret: string,
		private readonly defaultCurrency: string = 'vnd',
	) {
		this.stripe = new Stripe(this.secretKey, {
			apiVersion: '2026-05-27.dahlia',
		});
	}

	async createPaymentIntent(
		amount: number,
		currency?: string,
		metadata?: Record<string, string>,
	): Promise<PaymentIntentResult> {
		try {
			const intent = await this.stripe.paymentIntents.create({
				amount: Math.round(amount),
				currency: currency || this.defaultCurrency,
				metadata,
			});

			return {
				transactionId: intent.id,
				clientSecret: intent.client_secret as string,
			};
		} catch (error) {
			this.logger.error(`Failed to create Stripe Payment Intent: ${(error as Error).message}`);
			throw error;
		}
	}

	verifyWebhook(payload: Buffer, signature: string): any {
		try {
			return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
		} catch (error) {
			this.logger.error(`Webhook signature verification failed: ${(error as Error).message}`);
			throw error;
		}
	}
}
