import { Body, Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { GetUser } from '../../common/decorations/get-user.decoration';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	//# Register route
	async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
		return await this.authService.register(registerDto);
	}

	//# Refresh token route
	@UseGuards(RefreshTokenGuard)
	async refreshToken(@GetUser('id') userId: string): Promise<AuthResponseDto> {
		return await this.authService.refreshToken(userId);
	}

	//# Logout user and invalidate refresh token
	@UseGuards(JwtAuthGuard)
	async logout(@GetUser('id') userId: string): Promise<void> {}
}
