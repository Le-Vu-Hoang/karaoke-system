import { Injectable, Logger } from '@nestjs/common';
import { PaymentStrategy, PaymentIntentResult } from '../interface/payment-strategy.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class VNPayStrategy implements PaymentStrategy {
	private readonly logger = new Logger(VNPayStrategy.name);

	async createPaymentIntent(
		amount: number,
		currency: string,
		metadata?: Record<string, string>,
	): Promise<PaymentIntentResult> {
		this.logger.log(`Creating VNPay payment for amount: ${amount}`);
		
		// Sandbox config for VNPay
		// TODO: Implement actual VNPay URL generation here
		// const tmnCode = process.env.VNPAY_TMN_CODE;
		// const secretKey = process.env.VNPAY_SECRET_KEY;
		
		const transactionId = randomUUID();
		const mockPaymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef=${transactionId}&vnp_Amount=${amount * 100}`;

		return {
			transactionId,
			paymentUrl: mockPaymentUrl,
		};
	}

	verifyWebhook(payload: any, signature?: string): any {
		this.logger.log('Verifying VNPay webhook payload');
		
		// TODO: Implement VNPay signature (vnp_SecureHash) verification
		
		return {
			type: 'payment_intent.succeeded', // Map VNPay's successful status
			data: {
				object: {
					amount: payload.vnp_Amount ? parseInt(payload.vnp_Amount) / 100 : 0,
					metadata: {
						bookingId: payload.vnp_TxnRef // Or however you pass bookingId to VNPay
					},
				}
			}
		};
	}
}
