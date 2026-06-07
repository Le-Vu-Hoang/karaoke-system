import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingCleanupCron } from './cron/booking-cleanup.cron';
import { BookingController } from './booking.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
	imports: [PrismaModule, PricingModule],
	controllers: [BookingController],
	providers: [BookingService, BookingCleanupCron],
	exports: [BookingService],
})
export class BookingModule {}
