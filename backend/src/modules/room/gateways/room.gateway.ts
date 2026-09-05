import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  emitRoomStatusChanged(roomId?: string) {
    this.server.emit('room-status-changed', { roomId, timestamp: new Date() });
  }

  emitServiceRequest(data: { roomNumber: string; title: string; type: 'urgent' | 'normal' }) {
    this.server.emit('new-service-request', {
      id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
      roomNumber: data.roomNumber,
      title: data.title,
      type: data.type,
      timestamp: new Date(),
    });
  }
}
