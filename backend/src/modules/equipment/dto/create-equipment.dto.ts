import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { EquipmentStatus } from '@prisma/client';

export class CreateEquipmentDto {
  /**
   * ID của phòng chứa thiết bị.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  /**
   * Tên thiết bị (VD: Loa JBL, Micro không dây).
   * @example "Micro không dây JBL"
   */
  @Expose()
  @Transform(({ value }): string => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Số Serial của thiết bị (duy nhất).
   * @example "SN-123456789"
   */
  @Expose()
  @Transform(({ value }): string => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsOptional()
  serialNumber?: string;

  /**
   * Trạng thái hiện tại của thiết bị.
   * @example "ACTIVE"
   * @default "ACTIVE"
   */
  @Expose()
  @IsEnum(EquipmentStatus)
  @IsOptional()
  status?: EquipmentStatus;
}
