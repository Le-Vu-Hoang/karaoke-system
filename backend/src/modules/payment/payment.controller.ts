import * as common from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { PaymentService, PaymentProvider } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { Request } from 'express';

@ApiTags('payment')
@common.Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@common.Post('intent')
	@ApiOperation({ summary: 'Create a new Payment Intent' })
	@common.HttpCode(common.HttpStatus.CREATED)
	async createIntent(@common.Body() createPaymentIntentDto: CreatePaymentIntentDto) {
		return this.paymentService.createTransaction(createPaymentIntentDto.amount, 'STRIPE', createPaymentIntentDto.metadata);
	}

	@common.Post('webhook/:provider')
	@ApiOperation({ summary: 'Webhook Endpoint for Multiple Providers' })
	@ApiParam({ name: 'provider', enum: ['STRIPE', 'MOMO', 'VNPAY'] })
	@common.HttpCode(common.HttpStatus.OK)
	async handleWebhook(
		@common.Param('provider') provider: any,
		@common.Headers('stripe-signature') signature: string, // Kept for Stripe, ignored for others
		@common.Req() req: common.RawBodyRequest<Request>,
		@common.Body() body: any,
	) {
		// Use raw body for Stripe signature validation if needed, otherwise use parsed body
		const payload = provider === 'STRIPE' ? req.rawBody : body;
		
		if (provider === 'STRIPE' && (!signature || !payload)) {
			return; // Invalid stripe webhook
		}

		const event = await this.paymentService.verifyAndProcessWebhook(provider, payload, signature);

		return { received: true };
	}
}
