import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PricingModule } from '../pricing/pricing.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [PricingModule, RoomModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
