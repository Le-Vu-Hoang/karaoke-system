import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ShiftStatus } from '@prisma/client';

/**
 * Data Transfer Object cho việc tìm kiếm và lọc danh sách ca làm việc.
 */
export class ShiftQueryDto {
  /**
   * Trạng thái của ca (OPEN hoặc CLOSED).
   * @example "OPEN"
   */
  @IsOptional()
  @IsEnum(ShiftStatus)
  status?: ShiftStatus;

  /**
   * ID của nhân viên (staff) để lọc các ca của nhân viên này.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsOptional()
  @IsString()
  staffId?: string;

  /**
   * Lọc từ ngày (định dạng ISO).
   * @example "2026-08-01"
   */
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  /**
   * Lọc đến ngày (định dạng ISO).
   * @example "2026-08-31"
   */
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
