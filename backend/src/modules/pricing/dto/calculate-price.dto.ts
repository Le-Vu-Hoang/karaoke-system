import { IsUUID, IsNotEmpty, IsDateString } from 'class-validator';
import { Type, Expose } from 'class-transformer';

/**
 * Data Transfer Object cho yêu cầu tính toán tiền phòng.
 */
export class CalculatePriceDto {
	/**
	 * ID của loại phòng cần tính tiền.
	 */
	@Expose()
	@IsNotEmpty()
	@IsUUID()
	roomTypeId: string;

	/**
	 * Thời điểm bắt đầu hát (ISO String).
	 */
	@Expose()
	@IsNotEmpty()
	@Type(() => Date)
	@IsDateString()
	startTime: Date;

	/**
	 * Thời điểm kết thúc hát (ISO String).
	 */
	@Expose()
	@IsNotEmpty()
	@Type(() => Date)
	@IsDateString()
	endTime: Date;
}
