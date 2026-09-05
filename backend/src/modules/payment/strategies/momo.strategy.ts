import { Injectable, Logger } from '@nestjs/common';
import { PaymentStrategy, PaymentIntentResult, WebhookEventResult } from '../interface/payment-strategy.interface';
import { randomUUID } from 'crypto';
import type { MomoOptions } from '../interface/payment-module.interface';
import * as crypto from 'crypto';
import axios from 'axios';

export interface MomoWebhookPayload {
  accessKey?: string;
  amount?: number | string;
  extraData?: string;
  message?: string;
  orderId?: string;
  orderInfo?: string;
  orderType?: string;
  partnerCode?: string;
  payType?: string;
  requestId?: string;
  responseTime?: number | string;
  resultCode?: number | string;
  transId?: number | string;
  signature?: string;
  [key: string]: unknown;
}

@Injectable()
export class MomoStrategy implements PaymentStrategy {
  private readonly logger = new Logger(MomoStrategy.name);
  private readonly partnerCode: string;
  private readonly accessKey: string;
  private readonly secretKey: string;

  constructor(private readonly config: MomoOptions) {
    this.partnerCode = this.config.partnerCode;
    this.accessKey = this.config.accessKey;
    this.secretKey = this.config.secretKey;
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, string>,
  ): Promise<PaymentIntentResult> {
    this.logger.log(`Creating Momo payment for amount: ${amount}`);

    const transactionId = metadata?.bookingId || randomUUID();
    const orderId = transactionId;
    const orderInfo = `Thanh toan giao dich ${orderId}`;
    const requestId = randomUUID();
    const requestType = 'captureWallet';
    const extraData = '';

    // Create signature
    const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.config.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.config.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', this.secretKey).update(rawSignature).digest('hex');

    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: 'Luna Karaoke',
      storeId: 'MomoStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: this.config.redirectUrl,
      ipnUrl: this.config.ipnUrl,
      lang: 'vi',
      requestType: requestType,
      autoCapture: true,
      extraData: extraData,
      signature: signature,
    };

    try {
      const response = await axios.post(
        this.config.apiEndpoint || 'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
      );

      if (response.data && response.data.payUrl) {
        return {
          transactionId: orderId,
          paymentUrl: response.data.payUrl,
        };
      } else {
        this.logger.error('Failed to create Momo payment intent', response.data);
        throw new Error('Failed to retrieve Momo payUrl');
      }
    } catch (error: any) {
      this.logger.error('Error creating Momo payment intent', error.response?.data || error.message);
      throw error;
    }
  }

  verifyWebhook(payload: Record<string, unknown> | MomoWebhookPayload, _signature?: string): WebhookEventResult {
    this.logger.log('Verifying Momo webhook payload');

    const accessKey = this.accessKey; // Must use our config accessKey, MoMo doesn't send it in the IPN payload
    const amount = (payload.amount as string | number) ?? '';
    const extraData = (payload.extraData as string) || '';
    const message = (payload.message as string) || '';
    const orderId = (payload.orderId as string) || '';
    const orderInfo = (payload.orderInfo as string) || '';
    const orderType = (payload.orderType as string) || '';
    const partnerCode = (payload.partnerCode as string) || '';
    const payType = (payload.payType as string) || '';
    const requestId = (payload.requestId as string) || '';
    const responseTime = (payload.responseTime as string | number) ?? '';
    const resultCode = (payload.resultCode as string | number) ?? '';
    const transId = (payload.transId as string | number) ?? '';
    const receivedSignature = payload.signature as string;

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const computedSignature = crypto.createHmac('sha256', this.secretKey).update(rawSignature).digest('hex');

    if (computedSignature !== receivedSignature) {
      this.logger.error('Momo Webhook signature verification failed');
      throw new Error('Invalid signature');
    }

    const isSuccess = Number(resultCode) === 0;

    return {
      type: isSuccess ? 'payment_intent.succeeded' : 'payment_intent.failed',
      data: {
        object: {
          amount: Number(amount) || 0,
          metadata: {
            bookingId: orderId,
          },
        },
      },
    };
  }
}
