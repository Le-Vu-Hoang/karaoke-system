import { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from '@nestjs/common';

export interface PaymentOptions {
	stripeSecretKey: string;
	stripeWebhookSecret?: string;
	defaultCurrency?: string;
}

export interface PaymentAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	inject?: (InjectionToken | OptionalFactoryDependency)[];
	useFactory?: (...args: unknown[]) => Promise<PaymentOptions> | PaymentOptions;
}
