import { IsNotEmpty, IsNumber, Min } from 'class-validator';

/**
 * Data Transfer Object cho việc đóng ca (Close Shift).
 */
export class CloseShiftDto {
  /**
   * Số tiền mặt thực tế có trong két lúc kết thúc ca.
   *
   * @example 5000000
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  endingCash: number;
}
