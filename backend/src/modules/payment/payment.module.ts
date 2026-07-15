import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PaymentAsyncOptions } from './interface/payment-module.interface';
import { PaymentService } from './payment.service';
import { StripeStrategy } from './strategies/stripe.strategy';
import { MomoStrategy } from './strategies/momo.strategy';
import { VNPayStrategy } from './strategies/vnpay.strategy';

export const STRIPE_STRATEGY = 'STRIPE_STRATEGY';

@Global()
@Module({})
export class PaymentModule {
	static forRootAsync(options: PaymentAsyncOptions): DynamicModule {
		const stripeStrategyProvider: Provider = {
			provide: STRIPE_STRATEGY,
			inject: options.inject || [],
			useFactory: async (...args: unknown[]) => {
				if (!options.useFactory) {
					throw new Error('Async configuration is missing a useFactory method.');
				}

				const config = await options.useFactory(...args);

				return new StripeStrategy(config.stripeSecretKey, config.stripeWebhookSecret || '', config.defaultCurrency);
			},
		};

		return {
			module: PaymentModule,
			imports: options.imports || [],
			providers: [stripeStrategyProvider, MomoStrategy, VNPayStrategy, PaymentService],
			exports: [PaymentService],
		};
	}
}
