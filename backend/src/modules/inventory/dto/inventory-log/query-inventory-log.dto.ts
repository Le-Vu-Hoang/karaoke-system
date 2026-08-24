import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { InventoryChangeType } from '@prisma/client';

/**
 * DTO cho việc query lịch sử kho (InventoryLog)
 */
export class QueryInventoryLogDto {
  /**
   * Lọc theo ID của Dịch vụ/Mặt hàng
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  /**
   * Lọc theo loại thay đổi (IMPORT, SALE, DAMAGE)
   * @example "IMPORT"
   */
  @Expose()
  @IsOptional()
  @IsEnum(InventoryChangeType)
  changeType?: InventoryChangeType;
}
