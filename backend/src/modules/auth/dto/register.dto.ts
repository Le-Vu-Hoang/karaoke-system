import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsStrongPassword,
	MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; // Import thêm cái này

export class RegisterDto {
	@ApiProperty({
		example: 'Nguyễn Văn A',
		description: 'Họ và tên đầy đủ của khách hàng',
		maxLength: 100,
	})
	@Transform(({ value }): unknown => (typeof value === 'string' ? value.trim() : value))
	@IsNotEmpty({ message: 'Name is required' })
	@IsString()
	@MaxLength(100, { message: 'Name must not exceed 100 characters' })
	fullname: string;

	@ApiProperty({
		example: 'khachhang@gmail.com',
		description: 'Địa chỉ Email (tùy chọn)',
		required: false,
		maxLength: 255,
	})
	@Transform(({ value }): unknown => (typeof value === 'string' ? value.trim() : value))
	@IsEmail({}, { message: 'Please provide valid email' })
	@IsOptional()
	@MaxLength(255, { message: 'Email must not exceed 255 characters' })
	email?: string;

	@ApiProperty({
		example: '0912345678',
		description: 'Số điện thoại Việt Nam',
	})
	@Transform(({ value }): unknown => (typeof value === 'string' ? value.trim() : value))
	@IsPhoneNumber('VN', { message: 'Please provide valid phone number' })
	@IsNotEmpty({ message: 'Phone number is required' })
	phone: string;

	@ApiProperty({
		example: 'Karaoke@123',
		description:
			'Mật khẩu (yêu cầu ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt)',
		format: 'password',
	})
	@IsNotEmpty({ message: 'Password is required' })
	@IsStrongPassword(
		{
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message:
				'Password too weak, must include at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol',
		},
	)
	@MaxLength(100, { message: 'Password must not exceed 100 characters' })
	password: string;
}
