import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth.service';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    credentials: true,
  },
})
export class QrAuthGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly authService: AuthService) {}

  @SubscribeMessage('request-qr')
  handleRequestQr(@ConnectedSocket() client: Socket) {
    // Lấy SessionId từ AuthService
    const sessionId = this.authService.generateQrSession(client.id);

    // Gửi SessionId về lại cho đúng cái tab Web vừa kết nối
    client.emit('qr-generated', { sessionId });
  }

  // Phương thức này để Controller gọi sang khi điện thoại quét thành công
  notifyWebClientSuccess(socketId: string, authCode: string) {
    this.server.to(socketId).emit('qr-scanned-success', { authCode });
  }

  handleDisconnect(client: Socket) {
    // Dọn dẹp session rác khi Web đóng tab
    this.authService.removeSessionBySocketId(client.id);
  }
}
