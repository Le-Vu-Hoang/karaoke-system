import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoomStatus } from '@prisma/client';
import { RoomTypeResponseDto } from './room-type-response.dto';

export class RoomResponseDto {
	@ApiProperty({
		example: '0190b9e8-fa12-7abc-9d8e-ef0123456789',
		description: 'ID phòng (UUIDv7)',
	})
	@Expose()
	id: string;

	@ApiProperty({
		example: '0190a1b2-c3d4-7ebd-8f9a-bcde12345678',
		description: 'ID loại phòng liên kết',
	})
	@Expose()
	roomTypeId: string;

	@ApiProperty({ example: 'P101', description: 'Số hiệu / Tên phòng hát' })
	@Expose()
	roomNumber: string;

	@ApiProperty({
		enum: RoomStatus,
		example: RoomStatus.AVAILABLE,
		description: 'Trạng thái phòng hiện tại',
	})
	@Expose()
	status: RoomStatus;

	@ApiProperty({
		type: () => RoomTypeResponseDto,
		description: 'Thông tin chi tiết loại phòng đi kèm',
	})
	@Expose()
	@Type(() => RoomTypeResponseDto)
	roomType?: RoomTypeResponseDto;
}
