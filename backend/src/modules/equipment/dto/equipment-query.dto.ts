import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { EquipmentStatus } from '@prisma/client';

export class EquipmentQueryDto {
	/**
	 * Tìm kiếm theo tên hoặc số Serial
	 */
	@ApiPropertyOptional({ description: 'Tìm kiếm theo tên hoặc số Serial' })
	@Expose()
	@Transform(({ value }): string => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsOptional()
	search?: string;

	/**
	 * ID của phòng chứa thiết bị
	 */
	@ApiPropertyOptional({ description: 'Lọc theo ID phòng' })
	@Expose()
	@IsUUID()
	@IsOptional()
	roomId?: string;

	/**
	 * Trạng thái thiết bị
	 */
	@ApiPropertyOptional({ enum: EquipmentStatus, description: 'Lọc theo trạng thái thiết bị' })
	@Expose()
	@IsEnum(EquipmentStatus)
	@IsOptional()
	status?: EquipmentStatus;
}
