import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho thông tin danh mục dịch vụ.
 */
export class ServiceCategoryResponseDto {
  /**
   * ID của danh mục.
   *
   * @example 0190a1b2-c3d4-7ebd-8f9a-bcde12345678
   */
  @Expose()
  id: string;

  /**
   * Tên danh mục (VD: Đồ uống, Đồ ăn vặt).
   *
   * @example Đồ uống
   */
  @Expose()
  name: string;

  /**
   * Mô tả chi tiết danh mục.
   *
   * @example Các loại bia và nước ngọt
   */
  @Expose()
  description?: string | null;

  /**
   * URL hình ảnh của danh mục dịch vụ.
   *
   * @example https://res.cloudinary.com/...image.jpg
   */
  @Expose()
  imageUrl?: string | null;

  /**
   * Thứ tự hiển thị trên Menu.
   *
   * @example 1
   */
  @Expose()
  displayOrder: number;

  /**
   * Trạng thái hoạt động.
   *
   * @example true
   */
  @Expose()
  isActive: boolean;
}
