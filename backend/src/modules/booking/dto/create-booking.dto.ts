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
import { Type } from 'class-transformer';

export class CreateBookingDto {
	/**
	 * ID Khách hàng nếu đã có tài khoản ứng dụng
	 */
	@IsOptional()
	@IsUUID()
	customerId?: string;

	/**
	 * Tên khách hàng vãng lai (nếu không có tài khoản)
	 */
	@IsOptional()
	@IsString()
	guestName?: string;

	/**
	 * SĐT khách hàng vãng lai
	 */
	@IsOptional()
	@IsString()
	guestPhone?: string;

	/**
	 * ID loại phòng muốn đặt
	 */
	@IsNotEmpty()
	@IsUUID()
	roomTypeId: string;

	/**
	 * Chỉ định phòng cụ thể trước (nếu muốn)
	 */
	@IsOptional()
	@IsUUID()
	roomId?: string;

	/**
	 * Thời gian đặt phòng (ISO String)
	 */
	@IsNotEmpty()
	@Type(() => Date)
	@IsDateString()
	bookingTime: Date;

	/**
	 * Số giờ dự kiến hát
	 * @example 2
	 */
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	durationExpected: number;

	/**
	 * Số tiền đặt cọc trước (nếu có)
	 * @default 0
	 */
	@IsOptional()
	@IsNumber()
	@Min(0)
	deposit?: number;
}
