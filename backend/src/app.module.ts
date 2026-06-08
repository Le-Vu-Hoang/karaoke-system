import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
				stripeSecretKey: configService.get<string>('STRIPE_SECRET_KEY') || '',
				stripeWebhookSecret: configService.get<string>('STRIPE_WEBHOOK_SECRET') || '',
				defaultCurrency: 'vnd',
			}),
		}),
		ServicesModule,
		ShiftModule,
		RedisModule,
	],
	controllers: [AppController],
	providers: [AppService, JwtStrategy],
})
export class AppModule {}
