import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../common/decorations/get-user.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { Public } from '../../common/decorations/puclic.decorator';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('Auth')
@Serialize(AuthResponseDto)
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	private setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
		const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

		response.cookie('access_token', accessToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: 30 * 60 * 1000, // 30 mins
			path: '/',
		});

		response.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			path: '/',
		});
	}

	private clearAuthCookies(response: Response) {
		const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
		const options = {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? ('none' as const) : ('lax' as const),
			path: '/',
		};
		response.clearCookie('access_token', options);
		response.clearCookie('refresh_token', options);
	}

	//# Login route
	@Post('login')
	@Public()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Đăng nhập hệ thống' })
	@ApiResponse({ status: 200, description: 'Đăng nhập thành công', type: AuthResponseDto })
	@ApiResponse({ status: 401, description: 'Sai tài khoản hoặc mật khẩu' })
	async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
		const result = await this.authService.login(loginDto);
		this.setAuthCookies(response, result.accessToken, result.refreshToken);
		return result;
	}

	//# Register route
	@Post('register')
	@Public()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Đăng ký tài khoản mới' })
	@ApiResponse({ status: 201, description: 'Tạo tài khoản thành công', type: AuthResponseDto })
	@ApiResponse({ status: 409, description: 'Phone number đã tồn tại' })
	async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
		const result = await this.authService.register(registerDto);
		this.setAuthCookies(response, result.accessToken, result.refreshToken);
		return result;
	}

	//# Refresh token route
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@Public()
	@UseGuards(RefreshTokenGuard)
	@ApiBearerAuth('JWT')
	@ApiOperation({ summary: 'Làm mới Access Token' })
	@ApiResponse({ status: 200, type: AuthResponseDto })
	@ApiBadRequestResponse()
	async refreshToken(@GetUser('id') userId: string, @Res({ passthrough: true }) response: Response) {
		const result = await this.authService.refreshToken(userId);
		this.setAuthCookies(response, result.accessToken, result.refreshToken);
		return result;
	}

	//# Logout user and invalidate refresh token
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth('JWT')
	@ApiOperation({ summary: 'Đăng xuất và hủy Token' })
	@ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
	async logout(
		@GetUser('id') userId: string,
		@Res({ passthrough: true }) response: Response,
	): Promise<{ message: string }> {
		await this.authService.logout(userId);
		this.clearAuthCookies(response);
		return { message: 'Logged out successfully' };
	}
}
