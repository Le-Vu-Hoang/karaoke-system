import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  /**
   * Số tiền cần thanh toán.
   * @example 50000
   */
  @IsNumber()
  @Min(1)
  amount: number;

  /**
   * Đơn vị tiền tệ (Mặc định: vnd).
   * @example "usd"
   */
  @IsOptional()
  @IsString()
  currency?: string;

  /**
   * Cổng thanh toán.
   * @example "STRIPE"
   */
  @IsOptional()
  @IsString()
  provider?: string;

  /**
   * Dữ liệu đính kèm giao dịch (metadata).
   * @example { "bookingId": "12345", "userId": "abc" }
   */
  @IsOptional()
  metadata?: Record<string, string>;
}
