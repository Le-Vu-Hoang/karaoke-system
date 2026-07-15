import { IsNotEmpty, IsPhoneNumber, IsString, Matches } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

/**
 * DTO cho việc tạo mới Nhà cung cấp (Supplier)
 */
export class CreateSupplierDto {
	/**
	 * Tên nhà cung cấp
	 * @example "Đại lý bia nước ngọt ABC"
	 */
	@Expose()
	@Transform(({ value }): unknown => (typeof value === 'string' ? value.trim() : value))
	@IsNotEmpty()
	@IsString()
	name: string;

	/**
	 * Số điện thoại nhà cung cấp
	 * @example "0987654321"
	 */
	@IsNotEmpty()
	@IsPhoneNumber('VN', { message: 'Please provide valid phone number' })
	@IsNotEmpty({ message: 'Phone number is required' })
	@Transform(({ value }): unknown => (typeof value === 'string' ? value.trim() : value))
	phoneNumber: string;
}
