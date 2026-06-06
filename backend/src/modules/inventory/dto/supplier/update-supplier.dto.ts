import { PartialType } from '@nestjs/swagger';
import { CreateSupplierDto } from './create-supplier.dto';

/**
 * DTO cho việc cập nhật Nhà cung cấp (Supplier)
 */
export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
