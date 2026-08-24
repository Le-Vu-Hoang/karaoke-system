import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { EquipmentStatus } from '@prisma/client';

export class EquipmentQueryDto {
  /**
   * Tìm kiếm theo tên hoặc số Serial.
   * @example "Micro"
   */
  @Expose()
  @Transform(({ value }): string => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsOptional()
  search?: string;

  /**
   * ID của phòng chứa thiết bị.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  @IsUUID()
  @IsOptional()
  roomId?: string;

  /**
   * Trạng thái thiết bị.
   * @example "ACTIVE"
   */
  @Expose()
  @IsEnum(EquipmentStatus)
  @IsOptional()
  status?: EquipmentStatus;
}
