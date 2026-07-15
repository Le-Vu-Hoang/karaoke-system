import { IsNotEmpty, IsString, IsOptional, IsInt, IsBoolean, IsUrl } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc tạo mới danh mục dịch vụ.
 */
export class CreateServiceCategoryDto {
	/**
	 * URL hình ảnh của danh mục dịch vụ.
	 *
	 * @example https://res.cloudinary.com/...image.jpg
	 */
	@Expose()
	@IsString()
	@IsUrl({}, { message: 'Đường dẫn ảnh không hợp lệ' })
	@IsOptional()
	imageUrl?: string;

	/**
	 * Tên danh mục (VD: Đồ uống, Thức ăn nhanh).
	 *
	 * @example Đồ uống
	 */
	@Expose()
	@IsString()
	@IsNotEmpty({ message: 'Tên danh mục không được để trống' })
	name: string;

	/**
	 * Mô tả chi tiết về danh mục (không bắt buộc).
	 *
	 * @example Các loại nước giải khát và bia
	 */
	@Expose()
	@IsString()
	@IsOptional()
	description?: string;

	/**
	 * Thứ tự hiển thị trên menu (số nguyên).
	 *
	 * @example 1
	 */
	@Expose()
	@IsInt()
	@IsOptional()
	displayOrder?: number;

	/**
	 * Trạng thái hoạt động ban đầu của danh mục.
	 *
	 * @example true
	 */
	@Expose()
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}
