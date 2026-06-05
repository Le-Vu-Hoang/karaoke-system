import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type, Expose, Transform } from 'class-transformer';

export class CreateMaintenanceLogDto {
	/**
	 * Mô tả chi tiết bảo trì
	 */
	@ApiProperty({ description: 'Mô tả chi tiết lỗi hoặc nội dung bảo trì' })
	@Expose()
	@Transform(({ value }): string => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@IsNotEmpty()
	description: string;

	/**
	 * Chi phí bảo trì
	 */
	@ApiProperty({ description: 'Chi phí sửa chữa/bảo trì', type: Number })
	@Expose()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	cost: number;

	/**
	 * Ngày bảo trì
	 */
	@ApiPropertyOptional({ description: 'Ngày bảo trì (YYYY-MM-DD). Mặc định là ngày hiện tại' })
	@Expose()
	@IsDateString()
	@IsOptional()
	maintenanceDate?: string;
}
