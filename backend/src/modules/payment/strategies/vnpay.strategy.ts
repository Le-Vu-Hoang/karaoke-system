import { Injectable, Logger } from '@nestjs/common';
import { PaymentStrategy, PaymentIntentResult, WebhookEventResult } from '../interface/payment-strategy.interface';
import { randomUUID } from 'crypto';
import type { VNPayOptions } from '../interface/payment-module.interface';
import * as crypto from 'crypto';

export interface VNPayWebhookPayload {
  vnp_Amount?: string | number;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_OrderInfo?: string;
  vnp_PayDate?: string;
  vnp_ResponseCode?: string;
  vnp_TmnCode?: string;
  vnp_TransactionNo?: string;
  vnp_TransactionStatus?: string;
  vnp_TxnRef?: string;
  vnp_SecureHashType?: string;
  vnp_SecureHash?: string;
  [key: string]: unknown;
}

@Injectable()
export class VNPayStrategy implements PaymentStrategy {
  private readonly logger = new Logger(VNPayStrategy.name);
  private readonly tmnCode: string;
  private readonly secretKey: string;

  constructor(private readonly config: VNPayOptions) {
    this.tmnCode = this.config.terminalId;
    this.secretKey = this.config.secretKey;
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, string>,
  ): Promise<PaymentIntentResult> {
    this.logger.log(`Creating VNPay payment for amount: ${amount}`);

    const transactionId = metadata?.bookingId || randomUUID();
    const date = new Date();
    
    const yyyy = date.getFullYear().toString();
    const MM = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const HH = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');
    const createDate = `${yyyy}${MM}${dd}${HH}${mm}${ss}`;

    const ipAddr = metadata?.ipAddr || '127.0.0.1';
    
    const vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: transactionId,
      vnp_OrderInfo: `Thanh toan cho giao dich ${transactionId}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: this.config.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce<Record<string, string | number>>((acc, key) => {
        acc[key] = vnpParams[key];
        return acc;
      }, {});

    const signData = Object.keys(sortedParams)
      .map((key) => {
        const value = sortedParams[key];
        if (value === null || value === undefined || value === '') return '';
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value)).replace(/%20/g, '+')}`;
      })
      .filter(Boolean)
      .join('&');

    const hmac = crypto.createHmac('sha512', this.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    const paymentUrl = new URL(this.config.vnPayUrl);
    Object.keys(sortedParams).forEach(key => {
        paymentUrl.searchParams.append(key, String(sortedParams[key]));
    });
    paymentUrl.searchParams.append('vnp_SecureHash', signed);

    return {
      transactionId,
      paymentUrl: paymentUrl.toString(),
    };
  }

  verifyWebhook(payload: Record<string, unknown> | VNPayWebhookPayload, _signature?: string): WebhookEventResult {
    this.logger.log('Verifying VNPay webhook payload');

    const secureHash = payload['vnp_SecureHash'];
    if (!secureHash || typeof secureHash !== 'string') {
      this.logger.error('Missing vnp_SecureHash in VNPay webhook payload');
      throw new Error('Missing VNPay secure hash');
    }

    const vnpParams: Record<string, unknown> = { ...payload };
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    // Sort alphabetically
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = vnpParams[key];
        return acc;
      }, {});

    // Construct the query string.
    // Important: VNPay secure hash calculation requires using encodeURIComponent for both keys and values,
    // and replacing spaces with '+'.
    const signData = Object.keys(sortedParams)
      .map((key) => {
        const value = sortedParams[key];
        if (value === null || value === undefined || value === '') return '';
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value)).replace(/%20/g, '+')}`;
      })
      .filter(Boolean)
      .join('&');

    const hmac = crypto.createHmac('sha512', this.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash.toLowerCase() !== signed.toLowerCase()) {
      this.logger.error('VNPay Webhook signature verification failed');
      throw new Error('Invalid signature');
    }

    const responseCode = payload['vnp_ResponseCode'];
    const transactionStatus = payload['vnp_TransactionStatus'];
    const isSuccess = responseCode === '00' && transactionStatus === '00';

    const rawAmount = payload['vnp_Amount'];
    const amountNum =
      typeof rawAmount === 'number' ? rawAmount : typeof rawAmount === 'string' ? parseInt(rawAmount, 10) : 0;

    const txnRef = payload['vnp_TxnRef'];
    const bookingId = typeof txnRef === 'string' ? txnRef : String(txnRef || '');

    return {
      type: isSuccess ? 'payment_intent.succeeded' : 'payment_intent.failed',
      data: {
        object: {
          amount: amountNum ? amountNum / 100 : 0,
          metadata: {
            bookingId,
          },
        },
      },
    };
  }
}
