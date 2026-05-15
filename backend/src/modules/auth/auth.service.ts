import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	private readonly SALT_ROUNDS = 12;
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	//# Register service for new User
	async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
		const { fullname, phone, email, password } = registerDto;

		const checkExistingUser = await this.prisma.user.findUnique({
			where: { phoneNumber: phone },
		});

		if (checkExistingUser) {
			throw new ConflictException('This phone is already in use');
		}

		try {
			const hashPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
			const user = await this.prisma.user.create({
				data: {
					fullName: fullname,
					email,
					phoneNumber: phone,
					passwordHash: hashPassword,
				},
				select: {
					id: true,
					fullName: true,
					phoneNumber: true,
					role: true,
				},
			});

			const tokens = await this.generateTokens(user.id);
			await this.updateRefreshToken(user.id, tokens.refreshToken);

			return {
				...tokens,
				data: user,
			};
		} catch (err) {
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				if (err.code === 'P2002') {
					throw new ConflictException('Thông tin đăng ký đã tồn tại trong hệ thống');
				}
			}

			console.error(err);
			throw new InternalServerErrorException('Some thing went wrong');
		}
	}

	//# Generate access token and refresh token
	private async generateTokens(
		userId: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const payload = { sub: userId };
		const refreshId = randomBytes(16).toString('hex');
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, { expiresIn: '30m' }),
			this.jwtService.signAsync({ ...payload, refreshId }, { expiresIn: '7d' }),
		]);

		return { accessToken, refreshToken };
	}

	//# Update refresh token in database
	async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
		await this.prisma.user.update({
			where: { id: userId },
			data: { refreshToken: refreshToken },
		});
	}

	//# Refresh access token
	async refreshToken(userId: string): Promise<AuthResponseDto> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				fullName: true,
				phoneNumber: true,
				role: true,
			},
		});

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		const token = await this.generateTokens(user.id);
		await this.updateRefreshToken(user.id, token.refreshToken);

		return {
			...token,
			data: {
				id: user.id,
				fullName: user.fullName,
				phoneNumber: user.phoneNumber,
				role: user.role,
			},
		};
	}

	async logout(userId: string): Promise<void> {
		await this.prisma.user.update({
			where: { id: userId },
			data: { refreshToken: null },
		});
	}

	async login(loginDto: LoginDto): Promise<AuthResponseDto> {
		const { phoneNumber, password } = loginDto;

		const user = await this.prisma.user.findUnique({
			where: { phoneNumber: phoneNumber },
		});

		if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
			throw new ConflictException('Invalid phone number or password');
		}

		const token = await this.generateTokens(user.id);
		await this.updateRefreshToken(user.id, token.refreshToken);
		return {
			...token,
			data: {
				id: user.id,
				fullName: user.fullName,
				phoneNumber: user.phoneNumber,
				email: user.email || 'No email found',
				role: user.role,
			},
		};
	}
}
