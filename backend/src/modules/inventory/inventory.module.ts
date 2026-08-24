import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SupplierController } from './controllers/supplier/supplier.controller';
import { PurchaseOrderController } from './controllers/purchase-order/purchase-order.controller';
import { InventoryLogController } from './controllers/inventory-log/inventory-log.controller';
import { SupplierService } from './services/supplier/supplier.service';
import { PurchaseOrderService } from './services/purchase-order/purchase-order.service';
import { InventoryLogService } from './services/inventory-log/inventory-log.service';

@Module({
  imports: [PrismaModule],
  controllers: [SupplierController, PurchaseOrderController, InventoryLogController],
  providers: [SupplierService, PurchaseOrderService, InventoryLogService],
})
export class InventoryModule {}
