import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import bcrypt from 'bcrypt';
import { UpdateUserInfoDto } from './dto/update-info.dto';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async findOne(id: string): Promise<UserResponseDto> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				fullName: true,
				email: true,
				phoneNumber: true,
				role: true,
				createdAt: true,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
		const page = query.page ?? 1;
		const limit = query.limit ?? 10;

		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			this.prisma.user.findMany({
				skip,
				take: limit,
				orderBy: { createdAt: 'desc' },
				select: {
					id: true,
					fullName: true,
					phoneNumber: true,
					email: true,
					role: true,
					createdAt: true,
				},
			}),
			this.prisma.user.count(),
		]);

		const lastPage = Math.ceil(total / page);

		return {
			data: data,
			meta: {
				total,
				page,
				limit,
				lastPage,
				hasNextPage: page < lastPage,
				hasPreviousPage: page > 1,
			},
		};
	}

	async updateCurrentUser(userId: string, body: UpdateUserInfoDto): Promise<UserResponseDto> {
		const { fullName, phoneNumber, email } = body;

		const currentUser = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!currentUser) {
			throw new NotFoundException('Không tìm thấy người dùng');
		}

		if (phoneNumber && phoneNumber !== currentUser.phoneNumber) {
			const existingPhone = await this.prisma.user.findUnique({
				where: { phoneNumber: phoneNumber },
			});

			if (existingPhone) {
				throw new ConflictException('Số điện thoại này đã được đăng ký bởi một tài khoản khác.');
			}
		}

		if (email && email !== currentUser.email) {
			const existingEmail = await this.prisma.user.findUnique({
				where: { email: email },
			});

			if (existingEmail) {
				throw new ConflictException('Email này đã được đăng ký bởi một tài khoản khác.');
			}
		}

		return await this.prisma.user.update({
			where: { id: userId },
			data: {
				...(fullName && { fullName: fullName }),
				...(phoneNumber && { phoneNumber: phoneNumber }),
				...(email && { email: email }),
			},
			select: {
				id: true,
				fullName: true,
				phoneNumber: true,
				email: true,
				role: true,
				createdAt: true,
			},
		});
	}

	async changePassword(userId: string, body: ChangePasswordDto): Promise<string> {
		const { oldPassword, newPassword } = body;
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				passwordHash: true,
			},
		});

		if (!user) {
			throw new ConflictException('Old password is incorrect');
		}

		const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
		if (!isMatch) {
			throw new ConflictException('Old password is incorrect');
		}

		const newPasswordHash = await bcrypt.hash(newPassword, 10);

		await this.prisma.user.update({
			where: { id: userId },
			data: {
				passwordHash: newPasswordHash,
			},
		});

		return 'Change password successfully';
	}
}
