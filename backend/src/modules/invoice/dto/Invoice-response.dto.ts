import { Expose } from 'class-transformer';

/**
 * Data Transfer Object phản hồi thông tin chi tiết Hóa đơn.
 */
export class InvoiceResponseDto {
	/**
	 * ID của hóa đơn (UUIDv7).
	 */
	@Expose()
	id: string;

	/**
	 * ID của đơn đặt phòng liên quan (nếu có).
	 */
	@Expose()
	bookingId?: string | null;

	/**
	 * ID của phòng sử dụng.
	 */
	@Expose()
	roomId: string;

	/**
	 * ID nhân viên thực hiện.
	 */
	@Expose()
	staffId: string;

	/**
	 * Thời gian bắt đầu.
	 */
	@Expose()
	startTime: Date;

	/**
	 * Thời gian kết thúc.
	 */
	@Expose()
	endTime?: Date | null;

	/**
	 * Tổng tiền phòng.
	 */
	@Expose()
	roomTotal: number;

	/**
	 * Tổng tiền dịch vụ.
	 */
	@Expose()
	servicesTotal: number;

	/**
	 * Chiết khấu.
	 */
	@Expose()
	discount: number;

	/**
	 * Trạng thái hóa đơn.
	 *
	 * @example "UNPAID"
	 */
	@Expose()
	status: string;

	/**
	 * Tổng tiền cuối cùng.
	 *
	 * @example 0
	 */
	@Expose()
	finalTotal: number;
}
