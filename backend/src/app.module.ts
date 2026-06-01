import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { UsersModule } from './modules/users/users.module';
import { RoomModule } from './modules/room/room.module';
import { ShiftModule } from './modules/shift/shift.module';
import { ServicesModule } from './modules/services/services.module';
import { PaymentModule } from './modules/payment/payment.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { EquipmentsModule } from './modules/equipments/equipments.module';
import { BookingModule } from './modules/booking/booking.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { BookingController } from './modules/booking/booking.controller';
import { ServicesController } from './modules/services/services.controller';
import { InvoiceController } from './modules/invoice/invoice.controller';
import { PaymentController } from './modules/payment/payment.controller';
import { InventoryController } from './modules/inventory/inventory.controller';
import { ShiftController } from './modules/shift/shift.controller';
import { EquipmentsController } from './modules/equipments/equipments.controller';
import { PricingController } from './modules/pricing/pricing.controller';
import Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: Joi.object({
				PORT: Joi.number().default(3001),
				DATABASE_URL: Joi.string().required(),
				JWT_SECRET: Joi.string().required(),
			}),
		}),
		AuthModule,
		PrismaModule,
		UsersModule,
		RoomModule,
		PricingModule,
		BookingModule,
		EquipmentsModule,
		InventoryModule,
		InvoiceModule,
		PaymentModule,
		ServicesModule,
		ShiftModule,
	],
	controllers: [
		AppController,
		PricingController,
		BookingController,
		ServicesController,
		InvoiceController,
		PaymentController,
		InventoryController,
		ShiftController,
		EquipmentsController,
	],
	providers: [AppService, JwtStrategy],
})
export class AppModule {}
