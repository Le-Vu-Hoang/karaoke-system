import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentIntentCommand } from '../impl/create-payment-intent.command';
import { BadRequestException } from '@nestjs/common';
import { PaymentStrategy, PaymentIntentResult } from '../../interface/payment-strategy.interface';
import { StripeStrategy } from '../../strategies/stripe.strategy';
import { MomoStrategy } from '../../strategies/momo.strategy';
import { VNPayStrategy } from '../../strategies/vnpay.strategy';

@CommandHandler(CreatePaymentIntentCommand)
export class CreatePaymentIntentHandler implements ICommandHandler<CreatePaymentIntentCommand> {
  constructor(
    private readonly stripeStrategy: StripeStrategy,
    private readonly momoStrategy: MomoStrategy,
    private readonly vnPayStrategy: VNPayStrategy,
  ) {}

  async execute(command: CreatePaymentIntentCommand): Promise<PaymentIntentResult> {
    const { amount, provider, metadata } = command;
    const strategy = this.getStrategy(provider);
    return strategy.createPaymentIntent(amount, 'usd', metadata);
  }

  private getStrategy(provider: string): PaymentStrategy {
    switch (provider) {
      case 'STRIPE':
        return this.stripeStrategy;
      case 'MOMO':
        return this.momoStrategy;
      case 'VNPAY':
        return this.vnPayStrategy;
      default:
        throw new BadRequestException(`Provider ${provider} không hỗ trợ`);
    }
  }
}
