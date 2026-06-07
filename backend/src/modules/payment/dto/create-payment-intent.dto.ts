import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
	@ApiProperty({
		description: 'The amount to charge in the smallest currency unit (e.g. cents for VND).',
		example: 5000,
	})
	@IsNumber()
	@Min(1)
	amount: number;

	@ApiPropertyOptional({
		description: 'The currency for the payment intent. Defaults to vnd if not provided.',
		example: 'usd',
	})
	@IsOptional()
	@IsString()
	currency?: string;

	@ApiPropertyOptional({
		description: 'Additional metadata for the transaction.',
		example: { bookingId: '12345', userId: 'abc' },
	})
	@IsOptional()
	metadata?: Record<string, string>;
}
