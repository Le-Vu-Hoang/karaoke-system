import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { QrAuthGateway } from './gateways/qr-auth.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY') ?? 'defaultsecret2026',
        signOptions: { expiresIn: Number(configService.get<string>('JWT_EXPIRES_IN') || '3600s') },
      }),
    }),
    PrismaModule,
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, GoogleStrategy, FacebookStrategy, QrAuthGateway],
  controllers: [AuthController],
})
export class AuthModule {}
