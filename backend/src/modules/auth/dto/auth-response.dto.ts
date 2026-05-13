//* DTO for auth responing

import { Role } from '../../../../prisma/client';

export class AuthResponseDto {
	accessToken: string;
	refreshToken: string;
	data: {
		id: string;
		fullName: string;
		phoneNumber: string;
		email?: string;
		role: Role;
	};
}
