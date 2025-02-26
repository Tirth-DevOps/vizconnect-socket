import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyOrderUpdate(userId: string, order: any) {
    console.log('Notifying user...');

    this.server.to(userId).emit('orderUpdated', order);
  }

  //brodacast to all clients new order
  @SubscribeMessage('newOrder')
  async handleNewOrder(order: any) {
    console.log('New order received:', order);

    this.server.emit('newOrder', order);
  }
}
