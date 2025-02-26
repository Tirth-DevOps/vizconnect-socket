import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderGateway } from './order.gateway';
// import { DatabaseService } from 'src/database/database.service';

@Controller()
export class OrderController {
  constructor(
    private readonly orderGateway: OrderGateway
    // private readonly databaseService: DatabaseService
  ) {
    console.log('OrderConsumer initialized1'); // Add this log
  }

  @EventPattern('order.update')
  async handleOrderUpdated(@Payload() data: any) {
    console.log('Received order update:', data);
    console.log('Notifying user...');

    // const recentData = await this.databaseService.order.findMany({
    //   where: {
    //     userId: data.userId,
    //   },
    //   take: 8,
    // });

    // this.orderGateway.notifyOrderUpdate(data.userId, recentData);
  }

  @EventPattern('order.create')
  async handleOrderCreated(@Payload() data: any) {
    console.log('Received new order:', data);

    this.orderGateway.handleNewOrder(data);
  }
}
