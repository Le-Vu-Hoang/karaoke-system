import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PaymentSucceededEvent } from '../impl/payment-succeeded.event';
import { Logger } from '@nestjs/common';

import { PaymentService } from '../../payment.service';

@EventsHandler(PaymentSucceededEvent)
export class PaymentSucceededHandler implements IEventHandler<PaymentSucceededEvent> {
  private readonly logger = new Logger(PaymentSucceededHandler.name);

  constructor(private readonly paymentService: PaymentService) {}

  async handle(event: PaymentSucceededEvent) {
    const { bookingId, invoiceId, amount } = event;
    this.logger.log(
      `[Event Succeeded] Xử lý cập nhật cho Booking: ${bookingId || 'N/A'}, Invoice: ${invoiceId || 'N/A'}`,
    );

    try {
      if (bookingId) {
        await this.paymentService.handleBookingDepositSuccess(bookingId, amount);
      } else if (invoiceId) {
        await this.paymentService.handleInvoicePaymentSuccess(invoiceId, amount);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(error.message, error.stack);
      } else {
        this.logger.error('Lỗi không xác định: ', String(error));
      }

      throw error;
    }
  }
}
