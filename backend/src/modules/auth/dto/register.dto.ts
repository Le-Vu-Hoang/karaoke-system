//* Data transfer Object (DTO) for user registration

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

export class RegisterDto {
	@Transform(({ value }): unknown => (typeof value === 'string' ? value.trim() : value))
	@IsNotEmpty({ message: 'Name is required' })
	@IsString()
	@MaxLength(100, { message: 'Name must not exceed 100 characters' })
	fullname: string;

	@Transform(({ value }): unknown => (typeof value === 'string' ? value.trim() : value))
	@IsEmail({}, { message: 'Please provide valid email' })
	@IsOptional()
	@MaxLength(255, { message: 'Email must not exceed 255 characters' })
	email?: string;

	@Transform(({ value }): unknown => (typeof value === 'string' ? value.trim() : value))
	@IsPhoneNumber('VN', { message: 'Please provide valid phone number' })
	@IsNotEmpty({ message: 'Phone number is required' })
	phone: string;

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
