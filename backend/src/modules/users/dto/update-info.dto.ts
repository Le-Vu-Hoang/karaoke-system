import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber, MaxLength, IsEmail } from 'class-validator';

export class UpdateUserInfoDto {
	@ApiPropertyOptional({
		description: 'Họ và tên đầy đủ của người dùng',
		example: 'Nguyễn Văn A',
	})
	@IsOptional()
	@IsString({ message: 'Họ và tên phải là một chuỗi văn bản' })
	@MaxLength(100, { message: 'Họ và tên không được vượt quá 100 ký tự' })
	fullName?: string;

	@ApiPropertyOptional({
		description: 'Số điện thoại liên hệ (Phải là số duy nhất trong hệ thống)',
		example: '0987654321',
	})
	@IsOptional()
	@IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng Việt Nam' })
	phoneNumber?: string;

	@ApiPropertyOptional({
		description: 'Địa chỉ Email liên hệ (Phải là Email duy nhất trong hệ thống)',
		example: 'nguyenvana@example.com',
	})
	@IsOptional()
	@IsEmail({}, { message: 'Địa chỉ Email không hợp lệ' })
	email?: string;
}
