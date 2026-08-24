import { IsNotEmpty, IsUUID, IsNumber, Min, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Expose, Type } from 'class-transformer';

/**
 * DTO cho từng mặt hàng trong đơn nhập hàng
 */
export class PurchaseOrderItemDto {
  /**
   * ID của Dịch vụ/Mặt hàng (Service)
   */
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  /**
   * Số lượng nhập
   * @example 100
   */
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  /**
   * Đơn giá nhập
   * @example 15000
   */
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  unitPrice: number;
}

/**
 * DTO cho việc tạo đơn nhập hàng (PurchaseOrder)
 */
export class CreatePurchaseOrderDto {
  /**
   * ID của nhà cung cấp
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  supplierId: string;

  /**
   * Danh sách các mặt hàng nhập
   */
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
}
