import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ShiftStatus } from '@prisma/client';

/**
 * Data Transfer Object cho việc tìm kiếm và lọc danh sách ca làm việc.
 */
export class ShiftQueryDto {
	/**
	 * Trạng thái của ca (OPEN hoặc CLOSED).
	 */
	@IsOptional()
	@IsEnum(ShiftStatus)
	status?: ShiftStatus;

	/**
	 * ID của nhân viên (staff) để lọc các ca của nhân viên này.
	 */
	@IsOptional()
	@IsString()
	staffId?: string;

	/**
	 * Lọc từ ngày (định dạng ISO).
	 */
	@IsOptional()
	@IsDateString()
	fromDate?: string;

	/**
	 * Lọc đến ngày (định dạng ISO).
	 */
	@IsOptional()
	@IsDateString()
	toDate?: string;
}
