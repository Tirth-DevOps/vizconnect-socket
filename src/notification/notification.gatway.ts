import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

// Define interfaces or types

@WebSocketGateway({ cors: true })
@Injectable()
export class NotificationGateway {
  @WebSocketServer() server: Server;

  // Specify proper types
  sendNotificationToClients(notification: any) {
    this.server.emit('notification', notification);
  }
}
