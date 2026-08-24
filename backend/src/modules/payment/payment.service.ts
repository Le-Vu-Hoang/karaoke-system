import { Injectable, Logger } from '@nestjs/common';
import type { PaymentIntentResult, PaymentStrategy, WebhookEventResult } from './interface/payment-strategy.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeStrategy } from './strategies/stripe.strategy';
import { MomoStrategy } from './strategies/momo.strategy';
import { VNPayStrategy } from './strategies/vnpay.strategy';

export type PaymentProvider = 'STRIPE' | 'MOMO' | 'VNPAY';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly stripeStrategy: StripeStrategy,
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
        return this.stripeStrategy;
    }
  }

  async createTransaction(
    amount: number,
    provider: PaymentProvider = 'STRIPE',
    metadata?: Record<string, string>,
  ): Promise<PaymentIntentResult> {
    const strategy = this.getStrategy(provider);
    return strategy.createPaymentIntent(amount, 'vnd', metadata);
  }

  async verifyAndProcessWebhook(
    provider: PaymentProvider,
    payload: Record<string, unknown> | Buffer,
    signature?: string,
  ): Promise<WebhookEventResult> {
    const strategy = this.getStrategy(provider);
    const event = strategy.verifyWebhook(payload, signature);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata?.bookingId as string | undefined;
      const invoiceId = paymentIntent.metadata?.invoiceId as string | undefined;

      if (bookingId) {
        await this.handleBookingDepositSuccess(bookingId, paymentIntent.amount || 0);
      } else if (invoiceId) {
        await this.handleInvoicePaymentSuccess(invoiceId, paymentIntent.amount || 0);
      }
    }

    return event;
  }

  public async handleBookingDepositSuccess(bookingId: string, paidAmount: number) {
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
        paymentMethod: 'CARD',
        paymentType: 'DEPOSIT',
      },
    });

    this.logger.log(`Booking ${bookingId} confirmed & deposit payment saved.`);
  }

  public async handleInvoicePaymentSuccess(invoiceId: string, paidAmount: number) {
    this.logger.log(`Processing successful payment for invoice ${invoiceId}`);

    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { user: true },
    });

    if (!invoice) return;

    // Cập nhật trạng thái hóa đơn
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' },
    });

    // Cập nhật Loyalty Points và Total Spent cho User
    if (invoice.userId && invoice.user) {
      const earnedPoints = Math.floor(paidAmount / 10000); // Ví dụ: 10k VND = 1 điểm

      const updatedUser = await this.prisma.user.update({
        where: { id: invoice.userId },
        data: {
          totalSpent: { increment: paidAmount },
          loyaltyPoints: { increment: earnedPoints },
        },
      });

      // Kiểm tra thăng hạng
      await this.checkAndUpgradeMembership(updatedUser.id, Number(updatedUser.totalSpent));
    }

    // Ghi nhận log Payment
    await this.prisma.payment.create({
      data: {
        invoiceId: invoiceId,
        amount: paidAmount,
        paymentMethod: 'CARD',
        paymentType: 'FINAL_PAYMENT',
      },
    });

    this.logger.log(`Invoice ${invoiceId} paid & loyalty updated.`);
  }

  private async checkAndUpgradeMembership(userId: string, totalSpent: number) {
    // Lấy tất cả các hạng thành viên sắp xếp theo minSpent giảm dần
    const tiers = await this.prisma.membershipTier.findMany({
      orderBy: { minSpent: 'desc' },
    });

    // Tìm hạng cao nhất mà user đạt điều kiện
    const eligibleTier = tiers.find((tier) => totalSpent >= tier.minSpent.toNumber());

    if (eligibleTier) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.membershipTierId !== eligibleTier.id) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { membershipTierId: eligibleTier.id },
        });
        this.logger.log(`User ${userId} upgraded to Membership Tier: ${eligibleTier.name}`);
      }
    }
  }
}
