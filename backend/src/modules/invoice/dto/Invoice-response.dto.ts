import { Expose } from 'class-transformer';

export class InvoiceResponseDto {
	/**
	 * ID của hóa đơn
	 */
	@Expose()
	id: string;

	/**
	 * ID của đơn đặt phòng liên quan
	 */
	@Expose()
	bookingId: string;

	/**
	 * ID của phòng sử dụng
	 */
	@Expose()
	roomId: string;

	/**
	 * ID nhân viên thực hiện check-in
	 */
	@Expose()
	staffId: string;

	/**
	 * Trạng thái hóa đơn (VD: UNPAID, PAID)
	 * @example "UNPAID"
	 */
	@Expose()
	status: string;

	/**
	 * Tổng tiền hiện tại
	 * @example 0
	 */
	@Expose()
	finalTotal: number;

	/**
	 * Thời gian tạo hóa đơn
	 */
	@Expose()
	createdAt: Date;
}
