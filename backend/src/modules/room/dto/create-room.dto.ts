import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { RoomStatus } from '@prisma/client';

export class CreateRoomDto {
	@ApiProperty({ example: '0190...uuid', description: 'ID của loại phòng' })
	@IsUUID('7', { message: 'ID loại phòng phải là định dạng UUIDv7' })
	@IsNotEmpty({ message: 'Phải chọn loại phòng' })
	roomTypeId: string;

	@ApiProperty({ example: 'P101', description: 'Số hiệu / Tên phòng' })
	@IsString()
	@IsNotEmpty({ message: 'Số hiệu phòng không được để trống' })
	roomNumber: string;

	@ApiPropertyOptional({
		enum: RoomStatus,
		default: RoomStatus.AVAILABLE,
		description: 'Trạng thái khởi tạo của phòng',
	})
	@IsEnum(RoomStatus, { message: 'Trạng thái phòng không hợp lệ' })
	@IsOptional()
	status?: RoomStatus;
}
