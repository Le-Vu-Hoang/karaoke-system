import { Injectable, Logger } from '@nestjs/common';
import { PaymentIntentResult, PaymentStrategy, WebhookEventResult } from '../interface/payment-strategy.interface';
import Stripe from 'stripe';
import type { StripeOptions } from '../interface/payment-module.interface';

@Injectable()
export class StripeStrategy implements PaymentStrategy {
  private readonly stripe: InstanceType<typeof Stripe>;
  private readonly logger = new Logger(StripeStrategy.name);

  //# Khai báo các biến môi trường
  private readonly webhookSecret: string;
  private readonly defaultCurrency: string = 'vnd';

  constructor(private readonly config: StripeOptions) {
    this.webhookSecret = this.config.webhookSecret || '';
    this.defaultCurrency = this.config.defaultCurrency || 'vnd';

    this.stripe = new Stripe(this.config.secretKey, {
      apiVersion: '2026-07-29.dahlia',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency?: string,
    metadata?: Record<string, string>,
  ): Promise<PaymentIntentResult> {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency || this.defaultCurrency,
              product_data: {
                name: 'Tiền cọc đặt phòng Karaoke Luna',
                description: 'Tiền cọc giữ chỗ phòng hát',
              },
              unit_amount: Math.round(amount),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${frontendUrl}/profile/history`,
        cancel_url: `${frontendUrl}/booking`,
        metadata,
        payment_intent_data: {
          metadata,
        },
      });

      return {
        transactionId: session.id,
        paymentUrl: session.url as string,
      };
    } catch (error) {
      this.logger.error(`Failed to create Stripe Checkout Session: ${(error as Error).message}`);
      throw error;
    }
  }

  verifyWebhook(payload: Buffer | unknown, signature?: string): WebhookEventResult {
    try {
      const event = this.stripe.webhooks.constructEvent(payload as Buffer, signature || '', this.webhookSecret);
      return event as unknown as WebhookEventResult;
    } catch (error) {
      this.logger.error(`Webhook signature verification failed: ${(error as Error).message}`);
      throw error;
    }
  }
}
