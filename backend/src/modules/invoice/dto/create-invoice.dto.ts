import { IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc khởi tạo Hóa đơn.
 */
export class CreateInvoiceDto {
	/**
	 * ID của phòng khách hàng sử dụng.
	 */
	@Expose()
	@IsNotEmpty()
	@IsUUID()
	roomId: string;

	/**
	 * ID nhân viên thực hiện mở phòng/tạo hóa đơn.
	 */
	@Expose()
	@IsNotEmpty()
	@IsUUID()
	staffId: string;

	/**
	 * ID đơn đặt phòng (nếu khách có đặt trước).
	 */
	@Expose()
	@IsOptional()
	@IsUUID()
	bookingId?: string;
}
