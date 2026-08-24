import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckoutInvoiceDto {
  /**
   * Mã voucher khách hàng muốn áp dụng.
   * @example "SUMMER2026"
   */
  @IsOptional()
  @IsString()
  appliedVoucherCode?: string;
}
