//* DTO for auth responing

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

class UserResponseData {
	@ApiProperty({ example: 'clv123abc456', description: 'ID duy nhất của người dùng' })
	id: string;

	@ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên đầy đủ' })
	fullName: string;

	@ApiProperty({ example: '0912345678', description: 'Số điện thoại liên lạc' })
	phoneNumber: string;

	@ApiProperty({
		example: 'khachhang@gmail.com',
		description: 'Địa chỉ email (nếu có)',
		required: false,
	})
	email?: string;

	@ApiProperty({
		enum: Role,
		example: 'USER',
		description: 'Vai trò của người dùng trong hệ thống',
	})
	role: Role;
}

export class AuthResponseDto {
	@ApiProperty({
		description: 'Chuỗi Access Token dùng để truy cập các API bị chặn',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	accessToken: string;

	@ApiProperty({
		description: 'Chuỗi Refresh Token dùng để lấy Access Token mới khi hết hạn',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	refreshToken: string;

	@ApiProperty({
		type: UserResponseData,
		description: 'Thông tin chi tiết của người dùng vừa đăng nhập/đăng ký',
	})
	data: UserResponseData;
}
