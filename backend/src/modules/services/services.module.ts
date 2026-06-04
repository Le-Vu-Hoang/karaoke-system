import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
	imports: [PrismaService],
	controllers: [ServicesController],
	providers: [ServicesService],
	exports: [ServicesService],
})
export class ServicesModule {}
