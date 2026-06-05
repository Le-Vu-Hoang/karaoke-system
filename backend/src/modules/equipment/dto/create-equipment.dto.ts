import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { EquipmentStatus } from '@prisma/client';

export class CreateEquipmentDto {
	/**
	 * ID của phòng chứa thiết bị
	 */
	@ApiProperty({ description: 'ID của phòng chứa thiết bị' })
	@Expose()
	@IsUUID()
	@IsNotEmpty()
	roomId: string;

	/**
	 * Tên thiết bị
	 */
	@ApiProperty({ description: 'Tên thiết bị (VD: Loa JBL, Micro không dây)' })
	@Expose()
	@Transform(({ value }): string => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	name: string;

	/**
	 * Số Serial
	 */
	@ApiPropertyOptional({ description: 'Số Serial của thiết bị (duy nhất)' })
	@Expose()
	@Transform(({ value }): string => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsOptional()
	serialNumber?: string;

	/**
	 * Trạng thái thiết bị
	 */
	@ApiPropertyOptional({
		enum: EquipmentStatus,
		default: EquipmentStatus.ACTIVE,
		description: 'Trạng thái hiện tại của thiết bị',
	})
	@Expose()
	@IsEnum(EquipmentStatus)
	@IsOptional()
	status?: EquipmentStatus;
}
