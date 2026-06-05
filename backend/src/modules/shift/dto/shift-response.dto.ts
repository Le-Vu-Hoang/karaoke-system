import { Expose, Type } from 'class-transformer';
import { ShiftStatus } from '@prisma/client';

class UserSummaryDto {
	@Expose()
	id: string;

	@Expose()
	fullName: string;
}

/**
 * Data Transfer Object cho phản hồi chi tiết ca làm việc.
 */
export class ShiftResponseDto {
	@Expose()
	id: string;

	@Expose()
	staffId: string;

	@Expose()
	startTime: Date;

	@Expose()
	endTime: Date | null;

	@Expose()
	status: ShiftStatus;

	@Expose()
	startingCash: number;

	@Expose()
	endingCash: number | null;

	@Expose()
	expectedCash: number | null;

	@Expose()
	@Type(() => UserSummaryDto)
	staff: UserSummaryDto;
}
