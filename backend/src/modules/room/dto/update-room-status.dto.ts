import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoomStatus } from '@prisma/client';

export class UpdateRoomStatusDto {
	@ApiProperty({
		enum: RoomStatus,
		description: 'Trạng thái mới của phòng',
		example: RoomStatus.MAINTENANCE,
	})
	@IsEnum(RoomStatus, { message: 'Trạng thái phòng không hợp lệ' })
	@IsNotEmpty({ message: 'Không được để trống trạng thái' })
	status: RoomStatus;
}