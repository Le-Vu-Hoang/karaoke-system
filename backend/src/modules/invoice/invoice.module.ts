import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PricingModule } from '../pricing/pricing.module';

@Module({
	imports: [PricingModule],
	controllers: [InvoiceController],
	providers: [InvoiceService],
})
export class InvoiceModule {}
