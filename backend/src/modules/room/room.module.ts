import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
	imports: [PrismaService],
	controllers: [RoomController],
	providers: [RoomService],
	exports: [RoomService],
})
export class RoomModule {}
