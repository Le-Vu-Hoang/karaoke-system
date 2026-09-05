import { Module, Global } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RoomGateway } from './gateways/room.gateway';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
  exports: [RoomService, RoomGateway],
})
export class RoomModule {}
