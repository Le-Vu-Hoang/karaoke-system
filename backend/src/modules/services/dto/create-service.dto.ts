import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsUUID, IsUrl } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc tạo mới dịch vụ/món ăn.
 */
export class CreateServiceDto {
	/**
	 * URL hình ảnh của dịch vụ/món ăn.
	 *
	 * @example https://res.cloudinary.com/...image.jpg
	 */
	@Expose()
	@IsString()
	@IsUrl({}, { message: 'Đường dẫn ảnh không hợp lệ' })
	@IsOptional()
	imageUrl?: string;

	/**
	 * ID của danh mục (ServiceCategory) chứa dịch vụ này.
	 *
	 * @example 0190a1b2-c3d4-7ebd-8f9a-bcde12345678
	 */
	@Expose()
	@IsUUID('7', { message: 'ID danh mục phải là chuẩn UUID' })
	@IsNotEmpty({ message: 'Vui lòng chọn danh mục' })
	categoryId: string;

	/**
	 * Tên dịch vụ/món ăn.
	 *
	 * @example Bia Tiger
	 */
	@Expose()
	@IsString()
	@IsNotEmpty({ message: 'Tên dịch vụ không được để trống' })
	name: string;

	/**
	 * Giá bán (VNĐ).
	 *
	 * @example 25000
	 */
	@Expose()
	@IsNumber()
	@Min(0, { message: 'Giá bán không được âm' })
	price: number;

	/**
	 * Số lượng tồn kho ban đầu.
	 *
	 * @default 0
	 * @example 100
	 */
	@Expose()
	@IsOptional()
	@IsNumber()
	@Min(0)
	stockQuantity?: number;
}
