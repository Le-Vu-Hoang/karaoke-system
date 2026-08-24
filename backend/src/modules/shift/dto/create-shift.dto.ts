import { IsNotEmpty, IsNumber, Min } from 'class-validator';

/**
 * Data Transfer Object cho việc mở ca (Open Shift).
 */
export class CreateShiftDto {
  /**
   * Số tiền mặt ban đầu có trong két lúc mở ca.
   *
   * @example 1000000
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  startingCash: number;
}
