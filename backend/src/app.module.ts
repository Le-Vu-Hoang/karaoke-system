import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { UsersModule } from './modules/users/users.module';
import { RoomModule } from './modules/room/room.module';
import { ShiftModule } from './modules/shift/shift.module';
import { ServicesModule } from './modules/services/services.module';
import { BookingModule } from './modules/booking/booking.module';
import Joi from 'joi';
import { PricingModule } from './modules/pricing/pricing.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';
import { RedisModule } from './modules/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(4924),
        REDIS_PASSWORD: Joi.string().allow('').optional(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 4924),
        password: configService.get<string>('REDIS_PASSWORD'),
        ttl: 300000,
      }),
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    RoomModule,
    PricingModule,
    BookingModule,
    EquipmentModule,
    InventoryModule,
    InvoiceModule,
    PaymentModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        stripe: {
          secretKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
          webhookSecret: configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
          defaultCurrency: 'vnd',
        },

        momo: {
          partnerCode: configService.getOrThrow<string>('MOMO_PARTNER_CODE'),
          accessKey: configService.getOrThrow<string>('MOMO_ACCESS_KEY'),
          secretKey: configService.getOrThrow<string>('MOMO_SECRET_KEY'),
          apiEndpoint: configService.get('MOMO_API_ENDPOINT'),
          redirectUrl: configService.getOrThrow<string>('MOMO_REDIRECT_URL'),
          ipnUrl: configService.getOrThrow<string>('MOMO_IPN_URL'),
        },

        vnpay: {
          terminalId: configService.getOrThrow<string>('VNPAY_TERMINAL_ID'),
          secretKey: configService.getOrThrow<string>('VNPAY_SECRET_KEY'),
          vnPayUrl: configService.getOrThrow<string>('VNPAY_URL'),
          vnPayApi: configService.getOrThrow<string>('VNPAY_API'),
          returnUrl: configService.getOrThrow<string>('VNPAY_RETURN_URL'),
        },
      }),
    }),
    ServicesModule,
    ShiftModule,
    RedisModule,
    CloudinaryModule,
    VouchersModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
