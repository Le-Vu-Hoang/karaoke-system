import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc hủy hóa đơn.
 */
export class CancelInvoiceDto {
  /**
   * Lý do hủy hóa đơn.
   *
   * @example "Khách đổi ý"
   */
  @Expose()
  @IsNotEmpty()
  @IsString()
  reason: string;
}
