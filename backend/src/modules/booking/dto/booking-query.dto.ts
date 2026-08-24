import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { BookingStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc truy vấn danh sách đặt phòng.
 */
export class BookingQueryDto {
  /**
   * Tìm kiếm theo tên hoặc SĐT khách.
   * @example "0987654321"
   */
  @Expose()
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Lọc theo trạng thái đặt phòng.
   * @example "PENDING"
   */
  @Expose()
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  /**
   * Lọc từ ngày (YYYY-MM-DD).
   * @example "2026-08-01"
   */
  @Expose()
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  /**
   * Lọc đến ngày (YYYY-MM-DD).
   * @example "2026-08-31"
   */
  @Expose()
  @IsOptional()
  @IsDateString()
  toDate?: string;

  /**
   * Lọc theo loại phòng.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  @IsOptional()
  @IsString()
  roomTypeId?: string;
}
