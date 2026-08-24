import { IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc khởi tạo Hóa đơn.
 */
export class CreateInvoiceDto {
  /**
   * ID của phòng khách hàng sử dụng.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  /**
   * ID nhân viên thực hiện mở phòng/tạo hóa đơn.
   * @example "123e4567-e89b-12d3-a456-426614174001"
   */
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  staffId: string;

  /**
   * ID đơn đặt phòng (nếu khách có đặt trước).
   * @example "123e4567-e89b-12d3-a456-426614174002"
   */
  @Expose()
  @IsOptional()
  @IsUUID()
  bookingId?: string;
}
