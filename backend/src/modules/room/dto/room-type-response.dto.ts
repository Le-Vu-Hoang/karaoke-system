import { Expose, Type } from 'class-transformer';
import { Trim } from '../../../common/decorations/trim.decorator';
import { DecimalToNumber } from '../../../common/decorations/decimal-to-number.decorator';

/**
 * Data Transfer Object cho dữ liệu phản hồi của một loại phòng.
 */
export class RoomTypeResponseDto {
  /**
   * ID của loại phòng (UUIDv7).
   *
   * @example 0190a1b2-c3d4-7ebd-8f9a-bcde12345678
   */
  @Expose()
  id: string;

  /**
   * Tên của loại phòng.
   *
   * @example Phòng VIP
   */
  @Expose()
  name: string;

  /**
   * Sức chứa tối đa của phòng.
   *
   * @example 10
   */
  @Expose()
  capacity: number;

  /**
   * Giá cơ bản mỗi giờ của loại phòng này (VNĐ).
   * Tự động chuyển đổi kiểu Decimal của Prisma sang Number.
   *
   * @example 150000.0
   */
  @Expose()
  @Type(() => Number)
  @Trim()
  @DecimalToNumber()
  basePricePerHour: number;

  /**
   * Mô tả chi tiết loại phòng.
   *
   * @example Phòng có hệ thống loa JBL hiện đại
   */
  @Expose()
  description: string | null;

  /**
   * URL hình ảnh của loại phòng.
   *
   * @example https://res.cloudinary.com/...image.jpg
   */
  @Expose()
  imageUrl?: string | null;

  /**
   * Danh sách tiện ích nổi bật của loại phòng.
   *
   * @example ["Máy chiếu 4K", "Ban công view phố"]
   */
  @Expose()
  tags: string[];
}
