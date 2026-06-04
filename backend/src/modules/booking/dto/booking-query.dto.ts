import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { BookingStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

/**
 * Data Transfer Object cho việc truy vấn danh sách đặt phòng.
 */
export class BookingQueryDto {
	/**
	 * Tìm kiếm theo tên hoặc SĐT khách.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	search?: string;

	/**
	 * Lọc theo trạng thái đặt phòng.
	 */
	@Expose()
	@IsOptional()
	@IsEnum(BookingStatus)
	status?: BookingStatus;

	/**
	 * Lọc từ ngày (YYYY-MM-DD).
	 */
	@Expose()
	@IsOptional()
	@IsDateString()
	fromDate?: string;

	/**
	 * Lọc đến ngày (YYYY-MM-DD).
	 */
	@Expose()
	@IsOptional()
	@IsDateString()
	toDate?: string;

	/**
	 * Lọc theo loại phòng.
	 */
	@Expose()
	@IsOptional()
	@IsString()
	roomTypeId?: string;
}
