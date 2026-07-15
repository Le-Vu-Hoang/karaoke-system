//? Import library
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';

//? Refresh Token Strategy
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private configService: ConfigService,
		private prisma: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					return (req?.cookies?.['refresh_token'] as string) || null;
				},
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
			passReqToCallback: true,
		});
	}

	//# Validate refresh token
	async validate(req: Request, payload: { sub: string }) {
		let refreshToken = req.cookies?.['refresh_token'];
		if (!refreshToken) {
			const authHeader = req.headers.authorization;
			if (authHeader) {
				refreshToken = authHeader.replace('Bearer ', '').trim();
			}
		}

		if (!refreshToken) {
			throw new UnauthorizedException('Refresh token not found');
		}

		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
			select: {
				id: true,
				fullName: true,
				phoneNumber: true,
				role: true,
				refreshToken: true,
			},
		});

		if (!user || !user.refreshToken) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
		if (!refreshTokenMatches) {
			throw new UnauthorizedException('Invalid refresh token does not match');
		}

		return { id: user.id, fullName: user.fullName, phoneNumber: user.phoneNumber, role: user.role };
	}
}
