import { Expose, Type, Transform } from 'class-transformer';
import { ServiceCategoryResponseDto } from './service-category-response.dto';

/**
 * Data Transfer Object cho dữ liệu phản hồi của một dịch vụ/món ăn.
 */
export class ServiceResponseDto {
  /**
   * ID của dịch vụ/món ăn.
   *
   * @example 0190b9e8-fa12-7abc-9d8e-ef0123456789
   */
  @Expose()
  id: string;

  /**
   * ID của danh mục chứa món này.
   *
   * @example 0190a1b2-c3d4-7ebd-8f9a-bcde12345678
   */
  @Expose()
  categoryId: string;

  /**
   * Tên dịch vụ/món ăn.
   *
   * @example Bia Tiger
   */
  @Expose()
  name: string;

  /**
   * Giá bán (VNĐ).
   * Tự động chuyển đổi kiểu Decimal của Prisma sang Number.
   *
   * @example 25000.0
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }): unknown =>
    value && typeof value.toNumber === 'function' ? value.toNumber() : Number(value) || 0,
  )
  price: number;

  /**
   * Số lượng tồn kho hiện tại.
   *
   * @example 100
   */
  @Expose()
  stockQuantity: number;

  /**
   * Trạng thái hoạt động (true: Đang bán, false: Ngừng bán/Đã xóa).
   *
   * @example true
   */
  @Expose()
  isActive: boolean;

  /**
   * URL hình ảnh của dịch vụ.
   *
   * @example https://res.cloudinary.com/...image.jpg
   */
  @Expose()
  imageUrl?: string | null;

  /**
   * Thông tin chi tiết của danh mục (Có thể null nếu không include).
   */
  @Expose()
  @Type(() => ServiceCategoryResponseDto)
  category?: ServiceCategoryResponseDto;
}
