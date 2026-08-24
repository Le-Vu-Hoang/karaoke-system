import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PricingModule } from '../pricing/pricing.module';
import { BookingCronService } from './booking-cron.service';

@Module({
  imports: [PrismaModule, PricingModule],
  controllers: [BookingController],
  providers: [BookingService, BookingCronService],
  exports: [BookingService],
})
export class BookingModule {}
