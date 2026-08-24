import * as common from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentIntentCommand } from './commands/impl/create-payment-intent.command';
import { ProcessPaymentWebhookCommand } from './commands/impl/process-payment-webhook.command';
import { Public } from '../../common/decorations/puclic.decorator';

@ApiTags('payment')
@common.Controller('payment')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @common.Post('intent')
  @ApiOperation({ summary: 'Create a new Payment Intent' })
  @common.HttpCode(common.HttpStatus.CREATED)
  async createIntent(
    @common.Body() createPaymentIntentDto: CreatePaymentIntentDto,
    @common.Req() req: any,
  ) {
    const provider = (createPaymentIntentDto.provider || 'STRIPE') as 'STRIPE' | 'MOMO' | 'VNPAY';
    const metadata = {
      ...createPaymentIntentDto.metadata,
      ipAddr: req.ip || req.connection.remoteAddress || '127.0.0.1',
    };

    return this.commandBus.execute(
      new CreatePaymentIntentCommand(createPaymentIntentDto.amount, provider, metadata),
    );
  }

  @Public()
  @common.All('webhook/:provider')
  @ApiOperation({ summary: 'Webhook Endpoint for Multiple Providers' })
  @ApiParam({ name: 'provider', enum: ['STRIPE', 'MOMO', 'VNPAY'] })
  @common.HttpCode(common.HttpStatus.OK)
  async handleWebhook(
    @common.Param('provider') provider: string,
    @common.Headers('stripe-signature') signature: string, // Kept for Stripe, ignored for others
    @common.Req() req: common.RawBodyRequest<Request>,
    @common.Body() body: Record<string, unknown>,
    @common.Query() query: Record<string, unknown>,
  ) {
    const logger = new common.Logger('PaymentWebhook');
    logger.log(`Received Webhook from ${provider}. Method: ${req.method}. URL: ${req.originalUrl}`);
    logger.log(`Query: ${JSON.stringify(query)}`);
    logger.log(`Body: ${JSON.stringify(body)}`);
    let payload;
    if (provider.toUpperCase() === 'STRIPE') {
      payload = req.rawBody;
    } else if (req.method === 'GET') {
      payload = query;
    } else {
      payload = body;
    }

    if (provider.toUpperCase() === 'STRIPE' && (!signature || !payload)) {
      return;
    }
    try {
      // 4. Dispatch Command xử lý Webhook
      await this.commandBus.execute(new ProcessPaymentWebhookCommand(provider, payload, signature));
      
      if (provider.toUpperCase() === 'VNPAY') {
        return { RspCode: '00', Message: 'Confirm Success' };
      }
      return { received: true };
    } catch (error: any) {
      if (provider.toUpperCase() === 'VNPAY') {
        if (error.message === 'Invalid signature' || error.message === 'Missing VNPay secure hash') {
          return { RspCode: '97', Message: 'Invalid signature' };
        }
        return { RspCode: '99', Message: 'Unknown error' };
      }
      throw error;
    }
  }
}
