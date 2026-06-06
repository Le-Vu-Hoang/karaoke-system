import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * DTO cho việc tạo mới Nhà cung cấp (Supplier)
 */
export class CreateSupplierDto {
	/**
	 * Tên nhà cung cấp
	 * @example "Đại lý bia nước ngọt ABC"
	 */
	@Expose()
	@IsNotEmpty()
	@IsString()
	name: string;

	/**
	 * Số điện thoại nhà cung cấp
	 * @example "0987654321"
	 */
	@Expose()
	@IsNotEmpty()
	@IsString()
	@Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Số điện thoại không hợp lệ' })
	phoneNumber: string;
}
