import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  // Lưu trữ các phiên QR: Map<sessionId, socketId>
  private qrSessions = new Map<string, string>();

  // Lưu trữ Auth Codes dùng 1 lần (dùng để đổi lấy Token): Map<authCode, userId>
  private authCodes = new Map<string, string>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  //# QR Login Logic - Bắt đầu
  generateQrSession(socketId: string): string {
    const sessionId = randomBytes(16).toString('hex');
    this.qrSessions.set(sessionId, socketId);
    return sessionId;
  }

  getSocketId(sessionId: string): string | undefined {
    return this.qrSessions.get(sessionId);
  }

  removeQrSession(sessionId: string) {
    this.qrSessions.delete(sessionId);
  }

  removeSessionBySocketId(socketId: string) {
    for (const [sessionId, sockId] of this.qrSessions.entries()) {
      if (sockId === socketId) {
        this.qrSessions.delete(sessionId);
        break;
      }
    }
  }

  async generateAuthCodeForQr(userId: string): Promise<string> {
    const authCode = randomBytes(32).toString('hex');
    this.authCodes.set(authCode, userId);

    // Tự động xóa Auth Code sau 1 phút nếu Web không kịp "đổi" (Bảo mật)
    setTimeout(() => {
      this.authCodes.delete(authCode);
    }, 60 * 1000);

    return authCode;
  }

  async exchangeAuthCode(authCode: string): Promise<AuthResponseDto> {
    const userId = this.authCodes.get(authCode);
    if (!userId) {
      throw new UnauthorizedException('Mã xác thực không hợp lệ hoặc đã hết hạn');
    }

    // Đã dùng xong thì xóa luôn để không bị dùng lại (One-time use)
    this.authCodes.delete(authCode);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    const token = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, token.refreshToken);

    return {
      ...token,
      data: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        role: user.role,
        imageUrl: user.imageUrl,
      },
    };
  }
  //# QR Login Logic - Kết thúc

  //# Register service for new User
  async register(registerDto: RegisterDto) {
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
          imageUrl: true,
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
          throw new ConflictException('This phone is already in use');
        }
      }
      Logger.error(err);
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }

  //# Generate access token and refresh token
  private async generateTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId };
    const refreshId = randomBytes(16).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '30m' }),
      this.jwtService.signAsync(
        { ...payload, refreshId },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  //# Update refresh token in database
  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashRefreshToken = await bcrypt.hash(refreshToken, this.SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashRefreshToken },
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
        email: true,
        role: true,
        imageUrl: true,
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
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        role: user.role,
        imageUrl: user.imageUrl,
      },
    };
  }

  //# Logout logic
  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  //# Login logic
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { phoneNumber, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    if (user && user.provider !== 'LOCAL') {
      throw new ConflictException(
        `Tài khoản này đã được đăng ký bằng ${user.provider.toLowerCase()}. Vui lòng đăng nhập bằng ${user.provider.toLowerCase()}.`,
      );
    }

    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const token = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, token.refreshToken);
    return {
      ...token,
      data: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        role: user.role,
        imageUrl: user.imageUrl,
      },
    };
  }

  //# Process oauth login (chung cho cả google và facebook)
  async processOAuthLogin(
    oauthUser: { email: string; firstName: string; lastName: string; picture: string },
    provider: string,
  ) {
    // Tìm user theo email
    let user = await this.prisma.user.findUnique({
      where: { email: oauthUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: oauthUser.email,
          fullName: `${oauthUser.firstName || ''} ${oauthUser.lastName || ''}`.trim() || `${provider} User`,
          imageUrl: oauthUser.picture,
          provider: provider.toUpperCase() as any,
        },
      });
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
