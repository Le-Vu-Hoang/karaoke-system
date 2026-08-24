import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type, Expose, Transform } from 'class-transformer';

export class CreateMaintenanceLogDto {
  /**
   * Mô tả chi tiết lỗi hoặc nội dung bảo trì.
   * @example "Thay dây micro bị đứt"
   */
  @Expose()
  @Transform(({ value }): string => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Chi phí sửa chữa/bảo trì.
   * @example 50000
   */
  @Expose()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost: number;

  /**
   * Ngày bảo trì (YYYY-MM-DD). Mặc định là ngày hiện tại.
   * @example "2026-08-21"
   */
  @Expose()
  @IsDateString()
  @IsOptional()
  maintenanceDate?: string;
}
