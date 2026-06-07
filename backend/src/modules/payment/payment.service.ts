import { Inject, Injectable, Logger } from '@nestjs/common';
import type { PaymentIntentResult, PaymentStrategy } from './interface/payment-strategy.interface';
import { PrismaService } from '../../prisma/prisma.service';

export const PAYMENT_STRATEGY_TOKEN = 'PAYMENT_STRATEGY_TOKEN';

@Injectable()
export class PaymentService {
	private readonly logger = new Logger(PaymentService.name);

	constructor(
		@Inject(PAYMENT_STRATEGY_TOKEN) private readonly strategy: PaymentStrategy,
		private readonly prisma: PrismaService,
	) {}

	async createTransaction(
		amount: number,
		metadata?: Record<string, string>,
	): Promise<PaymentIntentResult> {
		return this.strategy.createPaymentIntent(amount, 'usd', metadata);
	}

	async verifyAndProcessWebhook(payload: Buffer, signature: string) {
		const event = this.strategy.verifyWebhook(payload, signature) as {
			type: string;
			data: { object: Record<string, unknown> };
		};

		if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object as {
				amount: number;
				metadata?: { bookingId?: string };
			};
			const bookingId = paymentIntent.metadata?.bookingId;

			if (bookingId) {
				await this.handleBookingDepositSuccess(bookingId, paymentIntent.amount);
			}
		}

		return event;
	}

	private async handleBookingDepositSuccess(bookingId: string, stripeAmount: number) {
		this.logger.log(`Processing successful deposit for booking ${bookingId}`);

		// 1. Lấy thông tin booking hiện tại
		const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
		if (!booking) return;

		// 2. Cập nhật trạng thái Booking
		await this.prisma.booking.update({
			where: { id: bookingId },
			data: { status: 'CONFIRMED' },
		});

		// 3. Ghi nhận log Payment
		await this.prisma.payment.create({
			data: {
				bookingId: bookingId,
				amount: booking.deposit || stripeAmount,
				paymentMethod: 'CARD',
				paymentType: 'DEPOSIT',
			},
		});

		this.logger.log(`Booking ${bookingId} confirmed & deposit payment saved.`);
	}
}
