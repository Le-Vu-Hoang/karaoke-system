import { Inject, Injectable, Logger, BadRequestException } from '@nestjs/common';
import type { PaymentIntentResult, PaymentStrategy } from './interface/payment-strategy.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { STRIPE_STRATEGY } from './payment.module';
import { MomoStrategy } from './strategies/momo.strategy';
import { VNPayStrategy } from './strategies/vnpay.strategy';

export type PaymentProvider = 'STRIPE' | 'MOMO' | 'VNPAY';

@Injectable()
export class PaymentService {
	private readonly logger = new Logger(PaymentService.name);

	constructor(
		@Inject(STRIPE_STRATEGY) private readonly stripeStrategy: PaymentStrategy,
		private readonly momoStrategy: MomoStrategy,
		private readonly vnPayStrategy: VNPayStrategy,
		private readonly prisma: PrismaService,
	) {}

	private getStrategy(provider: PaymentProvider): PaymentStrategy {
		switch (provider) {
			case 'STRIPE':
				return this.stripeStrategy;
			case 'MOMO':
				return this.momoStrategy;
			case 'VNPAY':
				return this.vnPayStrategy;
			default:
				throw new BadRequestException(`Unsupported payment provider: ${provider}`);
		}
	}

	async createTransaction(amount: number, provider: PaymentProvider = 'STRIPE', metadata?: Record<string, string>): Promise<PaymentIntentResult> {
		const strategy = this.getStrategy(provider);
		return strategy.createPaymentIntent(amount, 'usd', metadata);
	}

	async verifyAndProcessWebhook(provider: PaymentProvider, payload: any, signature?: string) {
		const strategy = this.getStrategy(provider);
		const event = strategy.verifyWebhook(payload, signature) as {
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

	private async handleBookingDepositSuccess(bookingId: string, paidAmount: number) {
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
				amount: booking.deposit || paidAmount,
				paymentMethod: 'CARD', // We can update this based on provider in future
				paymentType: 'DEPOSIT',
			},
		});

		this.logger.log(`Booking ${bookingId} confirmed & deposit payment saved.`);
	}
}

