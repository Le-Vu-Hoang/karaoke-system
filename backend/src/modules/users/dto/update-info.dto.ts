import { IsOptional, IsString, IsPhoneNumber, MaxLength, IsEmail } from 'class-validator';

export class UpdateUserInfoDto {
	/**
	 * Full name of the user
	 * @example "Nguyen Van A"
	 */
	@IsOptional()
	@IsString({ message: 'Full name must be a string' })
	@MaxLength(100, { message: 'Full name must not exceed 100 characters' })
	fullName?: string;

	/**
	 * Contact phone number (Must be unique in the system)
	 * @example "0987654321"
	 */
	@IsOptional()
	@IsPhoneNumber('VN', { message: 'Invalid Vietnamese phone number' })
	phoneNumber?: string;

	/**
	 * Contact email address (Must be unique in the system)
	 * @example "nguyenvana@example.com"
	 */
	@IsOptional()
	@IsEmail({}, { message: 'Invalid email address' })
	email?: string;
}
