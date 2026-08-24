import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { ProcessPaymentWebhookCommand } from '../impl/process-payment-webhook.command';
import { BadRequestException } from '@nestjs/common';
import { PaymentStrategy, WebhookEventResult } from '../../interface/payment-strategy.interface';
import { MomoStrategy } from '../../strategies/momo.strategy';
import { VNPayStrategy } from '../../strategies/vnpay.strategy';
import { StripeStrategy } from '../../strategies/stripe.strategy';
import { PaymentMethod } from '@prisma/client';
import { PaymentSucceededEvent } from '../../events/impl/payment-succeeded.event';

@CommandHandler(ProcessPaymentWebhookCommand)
export class ProcessPaymentWebhookHandler implements ICommandHandler<ProcessPaymentWebhookCommand> {
  constructor(
    private readonly stripeStrategy: StripeStrategy,
    private readonly momoStrategy: MomoStrategy,
    private readonly vnPayStrategy: VNPayStrategy,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ProcessPaymentWebhookCommand): Promise<WebhookEventResult> {
    const { provider, payload, signature } = command;
    const strategy = this.getStrategy(provider);
    const event = strategy.verifyWebhook(payload, signature);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata?.bookingId as string | undefined;
      const invoiceId = paymentIntent.metadata?.invoiceId as string | undefined;
      const amount = typeof paymentIntent.amount === 'number' ? paymentIntent.amount : 0;

      if (bookingId || invoiceId) {
        let dbMethod: PaymentMethod;
        switch (provider.toUpperCase()) {
          case 'STRIPE':
            dbMethod = 'CARD';
            break;
          case 'MOMO':
            dbMethod = 'MOMO';
            break;
          case 'VNPAY':
            dbMethod = 'BANK_TRANSFER';
            break;
          default:
            dbMethod = 'CARD';
        }
        // PHÁT EVENT THANH TOÁN THÀNH CÔNG RA TOÀN HỆ THỐNG
        this.eventBus.publish(new PaymentSucceededEvent(bookingId, amount, dbMethod, invoiceId));
      }
    }
    return event;
  }

  private getStrategy(provider: string): PaymentStrategy {
    switch (provider.toUpperCase()) {
      case 'STRIPE':
        return this.stripeStrategy;
      case 'MOMO':
        return this.momoStrategy;
      case 'VNPAY':
        return this.vnPayStrategy;
      default:
        throw new BadRequestException(`Provider ${provider} không hợp lệ`);
    }
  }
}
