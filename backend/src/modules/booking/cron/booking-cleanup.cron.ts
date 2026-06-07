import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingCleanupCron {
	private readonly logger = new Logger(BookingCleanupCron.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Quét mỗi phút 1 lần để tìm các booking PENDING đã tạo quá 15 phút mà chưa đóng cọc.
	 */
	@Cron(CronExpression.EVERY_MINUTE)
	async handleCron() {
		const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

		const expiredBookings = await this.prisma.booking.findMany({
			where: {
				status: BookingStatus.PENDING,
				createdAt: {
					lt: fifteenMinutesAgo,
				},
			},
		});

		if (expiredBookings.length === 0) {
			return;
		}

		this.logger.log(`Found ${expiredBookings.length} expired pending bookings. Cancelling...`);

		// Cập nhật trạng thái thành CANCELLED
		const result = await this.prisma.booking.updateMany({
			where: {
				id: {
					in: expiredBookings.map((b) => b.id),
				},
			},
			data: {
				status: BookingStatus.CANCELLED,
			},
		});

		this.logger.log(`Successfully cancelled ${result.count} bookings.`);
	}
}
