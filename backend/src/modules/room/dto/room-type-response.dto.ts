import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class RoomTypeResponseDto {
	@ApiProperty({
		example: '0190a1b2-c3d4-7ebd-8f9a-bcde12345678',
		description: 'ID loại phòng (UUIDv7)',
	})
	@Expose()
	id: string;

	@ApiProperty({ example: 'Phòng VIP', description: 'Tên loại phòng' })
	@Expose()
	name: string;

	@ApiProperty({ example: 10, description: 'Sức chứa tối đa' })
	@Expose()
	capacity: number;

	@ApiProperty({ example: 150000.0, description: 'Giá cơ bản mỗi giờ (VNĐ)' })
	@Expose()
	@Transform(({ value }) => (value ? Number(value) : 0))
	basePricePerHour: number;

	@ApiProperty({
		example: 'Phòng có hệ thống loa JBL hiện đại',
		description: 'Mô tả chi tiết',
		nullable: true,
	})
	@Expose()
	description: string | null;
}
