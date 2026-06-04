import { IsUUID, IsNotEmpty, IsInt, Min, Max, IsNumber, IsString, Matches } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc tạo mới một luật giá (Price Rule).
 */
export class CreatePriceRuleDto {
	/**
	 * ID của loại phòng áp dụng luật giá (UUIDv7).
	 */
	@Expose()
	@IsNotEmpty()
	@IsUUID()
	roomTypeId: string;

	/**
	 * Ngày trong tuần áp dụng (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7).
	 */
	@Expose()
	@IsNotEmpty()
	@IsInt()
	@Min(0)
	@Max(6)
	dayOfWeek: number;

	/**
	 * Thời gian bắt đầu áp dụng khung giá (Định dạng HH:mm hoặc HH:mm:ss).
	 *
	 * @example "18:00"
	 */
	@Expose()
	@IsNotEmpty()
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
		message: 'startTime phải theo định dạng HH:mm hoặc HH:mm:ss',
	})
	startTime: string;

	/**
	 * Thời gian kết thúc khung giá (Định dạng HH:mm hoặc HH:mm:ss).
	 *
	 * @example "23:59"
	 */
	@Expose()
	@IsNotEmpty()
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
		message: 'endTime phải theo định dạng HH:mm hoặc HH:mm:ss',
	})
	endTime: string;

	/**
	 * Giá tiền theo giờ trong khung giờ này.
	 */
	@Expose()
	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	pricePerHour: number;
}
