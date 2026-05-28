import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
	@ApiProperty({
		example: '018f3b2a-7b3b-7d3a-8f3b-2a7b3b7d3a8f',
		description: 'Mã định danh duy nhất của người dùng (định dạng UUID v7)',
	})
	id: string;

	@ApiProperty({
		example: 'Nguyễn Văn A',
		description: 'Họ và tên đầy đủ của người dùng',
	})
	fullName: string;

	@ApiProperty({
		example: '0901234567',
		description: 'Số điện thoại liên lạc chính thức (dùng để đặt phòng)',
	})
	phoneNumber: string;

	@ApiProperty({
		example: 'user@gmail.com',
		required: false,
		description: 'Địa chỉ email của người dùng (có thể để trống)',
	})
	email: string | null;

	@ApiProperty({
		enum: Role,
		example: Role.CUSTOMER,
		description:
			'Vai trò của người dùng trong hệ thống: CUSTOMER (Khách), STAFF (Nhân viên), ADMIN (Quản trị)',
	})
	role: Role;

	@ApiProperty({
		example: '2026-05-16T10:00:00.000Z',
		description: 'Thời điểm tài khoản được đăng ký trên hệ thống',
	})
	createdAt: Date;
}
