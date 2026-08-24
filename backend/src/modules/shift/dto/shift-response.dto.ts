import { Expose, Type, Transform } from 'class-transformer';
import { ShiftStatus } from '@prisma/client';

class UserSummaryDto {
  /**
   * ID của nhân viên.
   * @example "staff-123"
   */
  @Expose()
  id: string;

  /**
   * Tên nhân viên.
   * @example "Nguyen Van A"
   */
  @Expose()
  fullName: string;
}

/**
 * Data Transfer Object cho phản hồi chi tiết ca làm việc.
 */
export class ShiftResponseDto {
  /**
   * ID của ca làm việc (UUID).
   * @example "shift-456"
   */
  @Expose()
  id: string;

  /**
   * ID của nhân viên nhận ca.
   * @example "staff-123"
   */
  @Expose()
  staffId: string;

  /**
   * Thời gian bắt đầu ca.
   * @example "2026-08-21T07:00:00Z"
   */
  @Expose()
  startTime: Date;

  /**
   * Thời gian kết thúc ca (nếu đã đóng).
   * @example "2026-08-21T15:00:00Z"
   */
  @Expose()
  endTime: Date | null;

  /**
   * Trạng thái ca làm việc (OPEN/CLOSED).
   * @example "OPEN"
   */
  @Expose()
  status: ShiftStatus;

  /**
   * Số tiền mặt ban đầu trong két.
   * @example 2000000
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  startingCash: number;

  /**
   * Số tiền mặt thực tế khi đóng ca.
   * @example null
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }) => (value && typeof value.toNumber === 'function' ? value.toNumber() : Number(value) || null))
  endingCash: number | null;

  /**
   * Số tiền mặt dự kiến (Tiền ban đầu + Doanh thu mặt).
   * @example null
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }) => (value && typeof value.toNumber === 'function' ? value.toNumber() : Number(value) || null))
  expectedCash: number | null;

  /**
   * Thông tin tóm tắt của nhân viên.
   */
  @Expose()
  @Type(() => UserSummaryDto)
  staff: UserSummaryDto;
}
