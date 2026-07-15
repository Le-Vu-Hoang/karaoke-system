import { IsUUID, IsOptional, IsString, IsNotEmpty, Min, IsNumber, IsDate } from 'class-validator';
import { Type, Expose, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object cho việc tạo mới một đặt phòng.
 */
export class CreateBookingDto {
  /**
   * ID Khách hàng nếu đã có tài khoản ứng dụng.
   */
  @Expose()
  @IsOptional()
  @IsUUID()
  customerId?: string;

  /**
   * Tên khách hàng vãng lai (nếu không có tài khoản).
   */
  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  guestName?: string;

  /**
   * SĐT khách hàng vãng lai.
   */
  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  guestPhone?: string;

  /**
   * ID loại phòng muốn đặt.
   */
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  roomTypeId: string;

  /**
   * Thời gian đặt phòng (ISO String).
   */
  @Expose()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  /**
   * Thời gian hát xong
   */
  @Expose()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  /**
   * Số tiền đặt cọc trước (nếu có).
   *
   * @default 0
   */
  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  deposit: number;

  /**
   * Tên cổng thanh toán sẽ sử dụng để cọc.
   * Các giá trị hợp lệ: 'STRIPE', 'VNPAY', 'MOMO', 'CASH'.
   * @example "STRIPE"
   * @type {'STRIPE' | 'VNPAY' | 'MOMO'}
   */
  @Expose()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Payment provider must be a string' })
  paymentProvider?: string;

  /**
   * Ghi chú yêu cầu đặc biệt của khách hàng.
   * @example "Chuẩn bị thêm bánh sinh nhật và nến"
   */
  @Expose()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
