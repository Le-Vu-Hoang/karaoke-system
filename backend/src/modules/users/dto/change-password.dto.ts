import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
	@ApiProperty({
		description: 'Mật khẩu hiện tại của người dùng',
		example: 'OldPassword@123',
	})
	@IsString()
	@IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
	oldPassword: string;

	@ApiProperty({
		description: 'Mật khẩu mới (tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số)',
		example: 'NewStrongPassword@2026',
		minLength: 8,
	})
	@IsString()
	@IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
	@MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
	@Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
		message: 'Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số',
	})
	newPassword: string;

	@ApiProperty({
		description: 'Xác nhận lại mật khẩu mới',
		example: 'NewStrongPassword@2026',
	})
	@IsString()
	@IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
	confirmPassword: string;
}
