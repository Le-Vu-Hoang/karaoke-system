import { IsNotEmpty, IsString, IsInt, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc tạo mới loại phòng.
 */
export class CreateRoomTypeDto {
  /**
   * URL hình ảnh của loại phòng.
   *
   * @example https://res.cloudinary.com/...image.jpg
   */
  @Expose()
  @IsString()
  @IsUrl({}, { message: 'Đường dẫn ảnh không hợp lệ' })
  @IsOptional()
  imageUrl?: string;

  /**
   * Tên loại phòng (VD: Phòng VIP, Phòng Standard).
   *
   * @example Phòng VIP
   */
  @Expose()
  @IsString()
  @IsNotEmpty({ message: 'Tên loại phòng không được để trống' })
  name: string;

  /**
   * Sức chứa tối đa của phòng.
   *
   * @example 10
   */
  @Expose()
  @IsInt()
  @Min(1, { message: 'Sức chứa phải lớn hơn 0' })
  capacity: number;

  /**
   * Giá thuê cơ bản mỗi giờ của loại phòng này (VNĐ).
   *
   * @example 150000
   */
  @Expose()
  @IsNumber({}, { message: 'Giá tiền phải là một số' })
  @Min(0, { message: 'Giá tiền không được âm' })
  basePricePerHour: number;

  /**
   * Mô tả chi tiết về loại phòng (không bắt buộc).
   *
   * @example Phòng có view ban công, dàn âm thanh cao cấp
   */
  @Expose()
  @IsString()
  @IsOptional()
  description?: string;
}
