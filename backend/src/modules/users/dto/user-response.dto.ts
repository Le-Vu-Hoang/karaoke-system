import { Role } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserResponseDto {
	/**
	 * Unique identifier of the user (UUID v7 format)
	 * @example "018f3b2a-7b3b-7d3a-8f3b-2a7b3b7d3a8f"
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
	 * Official contact phone number (used for booking)
	 * @example "0901234567"
	 */
	@Expose()
	phoneNumber: string;

	/**
	 * Email address of the user (can be empty)
	 * @example "user@gmail.com"
	 */
	@Expose()
	email: string | null;

	/**
	 * Role of the user in the system: CUSTOMER, STAFF, ADMIN
	 * @example "CUSTOMER"
	 */
	@Expose()
	role: Role;

	/**
	 * Profile image URL
	 * @example "https://res.cloudinary.com/...image.jpg"
	 */
	@Expose()
	imageUrl: string | null;

	/**
	 * The time the account was registered on the system
	 */
	@Expose()
	createdAt: Date;
}
