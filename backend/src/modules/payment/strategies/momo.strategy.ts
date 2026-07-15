import { Injectable, Logger } from '@nestjs/common';
import { PaymentStrategy, PaymentIntentResult } from '../interface/payment-strategy.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class MomoStrategy implements PaymentStrategy {
	private readonly logger = new Logger(MomoStrategy.name);

	async createPaymentIntent(
		amount: number,
		currency: string,
		metadata?: Record<string, string>,
	): Promise<PaymentIntentResult> {
		this.logger.log(`Creating Momo payment for amount: ${amount}`);
		
		// Sandbox config for Momo
		// TODO: Implement actual Momo API call here
		// const accessKey = process.env.MOMO_ACCESS_KEY;
		// const secretKey = process.env.MOMO_SECRET_KEY;
		// const partnerCode = process.env.MOMO_PARTNER_CODE;
		
		const transactionId = randomUUID();
		const mockPaymentUrl = `https://test-payment.momo.vn/v2/gateway/pay?orderId=${transactionId}&amount=${amount}`;

		return {
			transactionId,
			paymentUrl: mockPaymentUrl,
		};
	}

	verifyWebhook(payload: any, signature?: string): any {
		this.logger.log('Verifying Momo webhook payload');
		
		// TODO: Implement Momo signature verification
		
		// Parse standard Momo webhook payload
		// Return a standard format for PaymentService to process
		return {
			type: 'payment_intent.succeeded', // Map Momo's successful status to a standard one
			data: {
				object: {
					amount: payload.amount,
					metadata: {
						bookingId: payload.orderId // Assuming orderId maps to bookingId or you pass bookingId in extraData
					},
				}
			}
		};
	}
}
