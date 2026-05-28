import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class BookingQueryDto {
	@ApiPropertyOptional({ description: 'Tìm kiếm theo tên hoặc SĐT khách' })
	@IsOptional()
	@IsString()
	search?: string;

	@ApiPropertyOptional({ enum: BookingStatus, description: 'Lọc theo trạng thái đặt phòng' })
	@IsOptional()
	@IsEnum(BookingStatus)
	status?: BookingStatus;

	@ApiPropertyOptional({ description: 'Lọc từ ngày (YYYY-MM-DD)' })
	@IsOptional()
	@IsDateString()
	fromDate?: string;

	@ApiPropertyOptional({ description: 'Lọc đến ngày (YYYY-MM-DD)' })
	@IsOptional()
	@IsDateString()
	toDate?: string;

	@ApiPropertyOptional({ description: 'Lọc theo loại phòng' })
	@IsOptional()
	@IsString()
	roomTypeId?: string;
}
