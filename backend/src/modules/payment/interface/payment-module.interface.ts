import { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from '@nestjs/common';

export interface StripeOptions {
  secretKey: string;
  webhookSecret: string;
  defaultCurrency?: string;
}

export interface MomoOptions {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  apiEndpoint?: string;
  redirectUrl: string;
  ipnUrl: string;
}

export interface VNPayOptions {
  terminalId: string;
  secretKey: string;
  vnPayUrl: string;
  vnPayApi: string;
  returnUrl: string;
}

export interface PaymentOptions {
  stripe?: StripeOptions;
  momo?: MomoOptions;
  vnpay?: VNPayOptions;
}

export interface PaymentAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory?: (...args: any[]) => Promise<PaymentOptions> | PaymentOptions;
}
