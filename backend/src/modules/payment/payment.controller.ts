import * as common from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
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
		return this.paymentService.createTransaction(
			createPaymentIntentDto.amount,
			createPaymentIntentDto.metadata,
		);
	}

	@common.Post('webhook')
	@ApiOperation({ summary: 'Stripe Webhook Endpoint' })
	@common.HttpCode(common.HttpStatus.OK)
	async handleWebhook(
		@common.Headers('stripe-signature') signature: string,
		@common.Req() req: common.RawBodyRequest<Request>,
	) {
		if (!signature) {
			return;
		}

		const rawBody = req.rawBody;
		if (!rawBody) {
			return;
		}

		const event = await this.paymentService.verifyAndProcessWebhook(rawBody, signature);

		return { received: true };
	}
}
