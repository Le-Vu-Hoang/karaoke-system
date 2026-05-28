import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRoomTypeDto {
	@ApiProperty({ example: 'Phòng VIP', description: 'Tên loại phòng' })
	@IsString()
	@IsNotEmpty({ message: 'Tên loại phòng không được để trống' })
	name: string;

	@ApiProperty({ example: 10, description: 'Sức chứa tối đa của phòng' })
	@IsInt()
	@Min(1, { message: 'Sức chứa phải lớn hơn 0' })
	capacity: number;

	@ApiProperty({ example: 150000, description: 'Giá cơ bản mỗi giờ (VNĐ)' })
	@IsNumber({}, { message: 'Giá tiền phải là một số' })
	@Min(0, { message: 'Giá tiền không được âm' })
	basePricePerHour: number;

	@ApiPropertyOptional({ example: 'Phòng có view ban công, dàn âm thanh cao cấp' })
	@IsString()
	@IsOptional()
	description?: string;
}
