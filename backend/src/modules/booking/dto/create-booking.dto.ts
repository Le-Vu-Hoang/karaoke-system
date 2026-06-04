import {
	IsUUID,
	IsOptional,
	IsString,
	IsNotEmpty,
	IsDateString,
	IsInt,
	Min,
	IsNumber,
} from 'class-validator';
import { Type, Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc tạo mới một đặt phòng.
 */
export class CreateBookingDto {
	/**
	 * ID Khách hàng nếu đã có tài khoản ứng dụng.
	 */
	@Expose()
	@IsOptional()
	@IsUUID()
	customerId?: string;

	/**
	 * Tên khách hàng vãng lai (nếu không có tài khoản).
	 */
	@Expose()
	@IsOptional()
	@IsString()
	guestName?: string;

	/**
	 * SĐT khách hàng vãng lai.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	guestPhone?: string;

	/**
	 * ID loại phòng muốn đặt.
	 */
	@Expose()
	@IsNotEmpty()
	@IsUUID()
	roomTypeId: string;

	/**
	 * Chỉ định phòng cụ thể trước (nếu muốn).
	 */
	@Expose()
	@IsOptional()
	@IsUUID()
	roomId?: string;

	/**
	 * Thời gian đặt phòng (ISO String).
	 */
	@Expose()
	@IsNotEmpty()
	@Type(() => Date)
	@IsDateString()
	bookingTime: Date;

	/**
	 * Số giờ dự kiến hát.
	 *
	 * @example 2
	 */
	@Expose()
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	durationExpected: number;

	/**
	 * Số tiền đặt cọc trước (nếu có).
	 *
	 * @default 0
	 */
	@Expose()
	@IsOptional()
	@IsNumber()
	@Min(0)
	deposit?: number;
}
