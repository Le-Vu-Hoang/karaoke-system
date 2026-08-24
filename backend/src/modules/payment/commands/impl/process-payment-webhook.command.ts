export class ProcessPaymentWebhookCommand {
  constructor(
    public readonly provider: string,
    public readonly payload: Record<string, unknown> | Buffer | unknown,
    public readonly signature?: string,
  ) {}
}
