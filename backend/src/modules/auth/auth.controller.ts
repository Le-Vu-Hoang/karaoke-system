import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { GetUser } from '../../common/decorations/get-user.decoration';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Đăng nhập hệ thống' })
	@ApiResponse({ status: 200, description: 'Đăng nhập thành công', type: AuthResponseDto })
	@ApiResponse({ status: 401, description: 'Sai tài khoản hoặc mật khẩu' })
	async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
		return await this.authService.login(loginDto);
	}
	//# Register route
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Đăng ký tài khoản mới' })
	@ApiResponse({ status: 201, description: 'Tạo tài khoản thành công', type: AuthResponseDto })
	@ApiResponse({ status: 409, description: 'Email đã tồn tại' })
	async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
		return await this.authService.register(registerDto);
	}

	//# Refresh token route
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@UseGuards(RefreshTokenGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Làm mới Access Token' })
	@ApiResponse({ status: 200, type: AuthResponseDto })
	async refreshToken(@GetUser('id') userId: string): Promise<AuthResponseDto> {
		return await this.authService.refreshToken(userId);
	}

	//# Logout user and invalidate refresh token
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Đăng xuất và hủy Token' })
	@ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
	@ApiOperation({ summary: 'Logout' })
	async logout(@GetUser('id') userId: string): Promise<{ message: string }> {
		await this.authService.logout(userId);
		return { message: 'Logged out successfully' };
	}
}
