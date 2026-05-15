import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty({
		description: 'Phone number of the user',
		example: '0123456789',
	})
	@IsString()
	@IsPhoneNumber('VI', { message: 'Invalid phone number' })
	@IsNotEmpty({ message: 'Invalid phone number' })
	phoneNumber: string;

	@ApiProperty({
		description: 'Password of the user',
		example: 'StrongP@ssword!',
	})
	@IsString()
	@IsNotEmpty({ message: 'Password is required' })
	password: string;
}
