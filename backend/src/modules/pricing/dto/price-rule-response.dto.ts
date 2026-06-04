import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho phản hồi của một luật giá.
 */
export class PriceRuleResponseDto {
	/**
	 * ID của luật giá.
	 */
	@Expose()
	id: string;

	/**
	 * ID loại phòng.
	 */
	@Expose()
	roomTypeId: string;

	/**
	 * Ngày trong tuần.
	 */
	@Expose()
	dayOfWeek: number;

	/**
	 * Giờ bắt đầu.
	 */
	@Expose()
	startTime: Date;

	/**
	 * Giờ kết thúc.
	 */
	@Expose()
	endTime: Date;

	/**
	 * Giá mỗi giờ.
	 */
	@Expose()
	pricePerHour: number;
}
