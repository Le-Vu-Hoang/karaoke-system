import { Role } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

class UserResponseData {
	/**
	 * Unique identifier of the user
	 * @example "clv123abc456"
	 */
	@Expose()
	id: string;

	/**
	 * Full name of the user
	 * @example "Nguyen Van A"
	 */
	@Expose()
	fullName: string;

	/**
	 * Contact phone number
	 * @example "0912345678"
	 */
	@Expose()
	phoneNumber: string;

	/**
	 * Email address (if available)
	 * @example "customer@gmail.com"
	 */
	@Expose()
	email?: string;

	/**
	 * Role of the user in the system
	 * @example "CUSTOMER"
	 */
	@Expose()
	role: Role;

	/**
	 * Profile image URL
	 * @example "https://res.cloudinary.com/...image.jpg"
	 */
	@Expose()
	imageUrl?: string | null;
}

export class AuthResponseDto {
	/**
	 * Access Token string used to access protected APIs
	 * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	 */
	@Expose()
	accessToken: string;

	/**
	 * Refresh Token string used to get a new Access Token when expired
	 * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	 */
	@Expose()
	refreshToken: string;

	/**
	 * Detailed information of the logged in or registered user
	 */
	@Expose()
	@Type(() => UserResponseData)
	data: UserResponseData;
}
