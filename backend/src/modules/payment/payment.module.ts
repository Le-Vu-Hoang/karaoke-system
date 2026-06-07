import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PaymentAsyncOptions } from './interface/payment-module.interface';
import { PAYMENT_STRATEGY_TOKEN, PaymentService } from './payment.service';
import { StripeStrategy } from './strategies/stripe.strategy';

@Global()
@Module({})
export class PaymentModule {
	static forRootAsync(options: PaymentAsyncOptions): DynamicModule {
		const strategyProvider: Provider = {
			provide: PAYMENT_STRATEGY_TOKEN,
			inject: options.inject || [],
			useFactory: async (...args: unknown[]) => {
				if (!options.useFactory) {
					throw new Error('Async configuration is missing a useFactory method.');
				}

				const config = await options.useFactory(...args);

				return new StripeStrategy(
					config.stripeSecretKey,
					config.stripeWebhookSecret || '',
					config.defaultCurrency,
				);
			},
		};

		return {
			module: PaymentModule,
			imports: options.imports || [],
			providers: [strategyProvider, PaymentService],
			exports: [PaymentService],
		};
	}
}
