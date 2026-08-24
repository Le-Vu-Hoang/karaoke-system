import { PaymentMethod } from '@prisma/client';

export class PaymentSucceededEvent {
  constructor(
    public readonly bookingId: string | undefined,
    public readonly amount: number,
    public readonly provider: PaymentMethod,
    public readonly invoiceId?: string,
  ) {}
}
