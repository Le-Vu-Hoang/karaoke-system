import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { InventoryChangeType } from '@prisma/client';

/**
 * DTO cho việc query lịch sử kho (InventoryLog)
 */
export class QueryInventoryLogDto {
	/**
	 * Lọc theo ID của Dịch vụ/Mặt hàng
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
