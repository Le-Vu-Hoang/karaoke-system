import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc gọi thêm dịch vụ vào hóa đơn.
 */
export class AddServiceDto {
  /**
   * ID của dịch vụ/sản phẩm được gọi.
   */
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  /**
   * Số lượng gọi.
   *
   * @example 1
   */
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
