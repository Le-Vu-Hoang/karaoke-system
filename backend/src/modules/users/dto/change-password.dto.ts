import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
	/**
	 * Current password of the user
	 * @example "OldPassword@123"
	 */
	@IsString()
	@IsNotEmpty({ message: 'Current password is required' })
	oldPassword: string;

	/**
	 * New password (requires at least 8 characters, including uppercase, lowercase, and numbers)
	 * @example "NewStrongPassword@2026"
	 */
	@IsString()
	@IsNotEmpty({ message: 'New password is required' })
	@MinLength(8, { message: 'New password must be at least 8 characters long' })
	@Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, {
		message: 'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
	})
	newPassword: string;

	/**
	 * Confirmation of the new password
	 * @example "NewStrongPassword@2026"
	 */
	@IsString()
	@IsNotEmpty({ message: 'Confirm password is required' })
	confirmPassword: string;
}
