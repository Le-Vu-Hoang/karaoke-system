import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PaymentAsyncOptions } from './interface/payment-module.interface';
import { PaymentService } from './payment.service';
import { StripeStrategy } from './strategies/stripe.strategy';
import { MomoStrategy } from './strategies/momo.strategy';
import { VNPayStrategy } from './strategies/vnpay.strategy';
import { CreatePaymentIntentHandler } from './commands/handlers/create-payment-intent.handler';
import { ProcessPaymentWebhookHandler } from './commands/handlers/process-payment-webhook.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentSucceededHandler } from './events/handlers/payment-succeeded.handler';
import { PaymentController } from './payment.controller';

import { PaymentOptions } from './interface/payment-module.interface';

export const PAYMENT_OPTIONS = 'PAYMENT_OPTIONS';

const stripeStrategyProvider: Provider = {
  provide: StripeStrategy,
  inject: [PAYMENT_OPTIONS],
  useFactory: (config: PaymentOptions) => {
    if (!config.stripe) {
      throw new Error('Stripe configuration is missing');
    }
    return new StripeStrategy(config.stripe);
  },
};

const momoStrategyProvider: Provider = {
  provide: MomoStrategy,
  inject: [PAYMENT_OPTIONS],
  useFactory: (config: PaymentOptions) => {
    if (!config.momo) {
      throw new Error('Momo configuration is missing');
    }
    return new MomoStrategy(config.momo);
  },
};

const vnPayStrategyProvider: Provider = {
  provide: VNPayStrategy,
  inject: [PAYMENT_OPTIONS],
  useFactory: (config: PaymentOptions) => {
    if (!config.vnpay) {
      throw new Error('VNPay configuration is missing');
    }
    return new VNPayStrategy(config.vnpay);
  },
};

const CommandHandlers = [CreatePaymentIntentHandler, ProcessPaymentWebhookHandler];
const EventHandlers = [PaymentSucceededHandler];

@Global()
@Module({
  imports: [CqrsModule],
  controllers: [PaymentController],
  providers: [PaymentService, ...CommandHandlers, ...EventHandlers],
  exports: [PaymentService, CqrsModule],
})
export class PaymentModule {
  static forRootAsync(options: PaymentAsyncOptions): DynamicModule {
    const paymentConfigProvider: Provider = {
      provide: PAYMENT_OPTIONS,
      inject: options.inject || [],
      useFactory: async (...args: unknown[]) => {
        if (!options.useFactory) {
          throw new Error('Async configuration is missing a useFactory method.');
        }
        return options.useFactory(...args);
      },
    };

    return {
      module: PaymentModule,
      imports: options.imports || [],
      controllers: [PaymentController],
      providers: [
        paymentConfigProvider,
        stripeStrategyProvider,
        momoStrategyProvider,
        vnPayStrategyProvider,
        PaymentService,
        ...CommandHandlers,
        ...EventHandlers,
      ],
      exports: [PaymentService],
    };
  }
}
