import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../../common/decorations/get-user.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { Public } from '../../common/decorations/puclic.decorator';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleOauthGuard } from '../../common/guards/google-oauth.guard';
import { FacebookOauthGuard } from '../../common/guards/facebook-oauth.guard';
import { QrAuthGateway } from './gateways/qr-auth.gateway';

@Controller('auth')
@ApiTags('Auth')
@Serialize(AuthResponseDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly qrGateway: QrAuthGateway,
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

  //# Oauth controller to get gg redirect
  @Get('google')
  @Public()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  //# Callback url
  @Get('google/callback')
  @Public()
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(
    @Req() req: Request & { user: { email: string; firstName: string; lastName: string; picture: string } },
    @Res() res: Response,
  ) {
    const googleUser = req.user;
    const { accessToken, refreshToken } = await this.authService.processOAuthLogin(googleUser, 'google');
    this.setAuthCookies(res, accessToken, refreshToken);
    //? Cuối cùng: Redirect thẳng user về trang chủ của Frontend
    return res.redirect('http://localhost:3000/');
  }

  //# Facebook get redirect
  @Get('facebook')
  @Public()
  @UseGuards(FacebookOauthGuard)
  async facebookAuth() {}

  //# Callback url for facebook
  @Get('facebook/callback')
  @Public()
  @UseGuards(FacebookOauthGuard)
  async facebookAuthRedirect(
    @Req() req: Request & { user: { email: string; firstName: string; lastName: string; picture: string } },
    @Res() res: Response,
  ) {
    const facebookUser = req.user;
    const { accessToken, refreshToken } = await this.authService.processOAuthLogin(facebookUser, 'facebook');
    this.setAuthCookies(res, accessToken, refreshToken);
    return res.redirect('http://localhost:3000/');
  }

  //# Điện thoại quét mã QR
  @Post('qr/scan')
  @ApiBearerAuth('JWT') // Bắt buộc user (nhân viên) trên điện thoại phải đang đăng nhập
  @ApiOperation({ summary: 'Điện thoại quét mã QR để cấp quyền đăng nhập cho Web' })
  async scanQr(@GetUser('id') userId: string, @Body('sessionId') sessionId: string) {
    if (!sessionId) throw new UnauthorizedException('Thiếu Session ID');

    // 1. Lấy socketId của Web đang chờ
    const socketId = this.authService.getSocketId(sessionId);
    if (!socketId) {
      throw new UnauthorizedException('Mã QR không hợp lệ hoặc đã hết hạn');
    }

    // 2. Tạo mã Auth Code 1 lần
    const authCode = await this.authService.generateAuthCodeForQr(userId);

    // 3. Đẩy Auth Code về cho màn hình Web thông qua Socket
    this.qrGateway.notifyWebClientSuccess(socketId, authCode);

    // 4. Xóa session để mã QR này không thể quét lại lần 2
    this.authService.removeQrSession(sessionId);

    return { message: 'Đăng nhập Web thành công!' };
  }

  //# Web dùng Auth Code để đổi lấy Cookie và Token
  @Post('qr/exchange')
  @Public() // Màn hình Web lúc này chưa đăng nhập nên Route này cần phải Public
  @ApiOperation({ summary: 'Web dùng Auth Code để đổi lấy Token và Cookie' })
  async exchangeQrCode(@Body('authCode') authCode: string, @Res({ passthrough: true }) response: Response) {
    if (!authCode) throw new UnauthorizedException('Thiếu Auth Code');

    // Đổi Auth Code lấy Token
    const result = await this.authService.exchangeAuthCode(authCode);

    // Gài thẳng Cookie vào màn hình Web luôn
    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    return result;
  }
}
