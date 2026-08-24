import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookingCronService {
  private readonly logger = new Logger(BookingCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleAutoCancelUnpaidBookings() {
    this.logger.debug('Running auto-cancel for unpaid pending bookings...');

    // Cancel pending bookings older than 15 minutes
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() - 15);

    const expiredBookings = await this.prisma.booking.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: expirationTime,
        },
      },
    });

    if (expiredBookings.length > 0) {
      const expiredIds = expiredBookings.map((b) => b.id);

      const { count } = await this.prisma.booking.updateMany({
        where: {
          id: { in: expiredIds },
        },
        data: {
          status: 'CANCELLED',
          notes: 'AUTO_CANCEL_TIMEOUT',
        },
      });

      this.logger.log(`Auto-cancelled ${count} expired bookings.`);
    }
  }
}
