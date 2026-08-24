import { PaymentProvider } from '../../payment.service';

export class CreatePaymentIntentCommand {
  constructor(
    public readonly amount: number,
    public readonly provider: PaymentProvider,
    public readonly metadata?: Record<string, string>,
  ) {}
}
