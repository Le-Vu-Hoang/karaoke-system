import { Expose, Type, Transform } from 'class-transformer';

/**
 * Data Transfer Object cho phản hồi của một luật giá.
 */
export class PriceRuleResponseDto {
  /**
   * ID của luật giá.
   * @example "rule-123"
   */
  @Expose()
  id: string;

  /**
   * ID loại phòng.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  roomTypeId: string;

  /**
   * Ngày trong tuần.
   * @example 5
   */
  @Expose()
  dayOfWeek: number;

  /**
   * Giờ bắt đầu.
   * @example "18:00:00"
   */
  @Expose()
  startTime: Date;

  /**
   * Giờ kết thúc.
   * @example "23:59:59"
   */
  @Expose()
  endTime: Date;

  /**
   * Giá mỗi giờ.
   * @example 150000
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  pricePerHour: number;
}
