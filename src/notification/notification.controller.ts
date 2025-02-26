import { Controller } from '@nestjs/common';
import {  EventPattern, Payload } from '@nestjs/microservices';
import { DatabaseService } from 'src/database/database.service';
import { NotificationGateway } from './notification.gatway';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly databaseService: DatabaseService,
  ) {
    console.log('NotificationConsumer initialized');
  }

  @EventPattern('notification.read')
  async handleNotification(@Payload() data: any) {
    console.log('🔔 Received notification payload:', data);

    const userId = data.user?.id; // Extract userId from AuthGuard
    console.log('🔔 User ID:', userId);

    // Fetch unread notifications count
    const unreadCount = await this.databaseService.notification.count({
      where: {
        userId: userId, 
        read: false,
      },
    });

    console.log('📩 Unread notifications count:', unreadCount);

    // Send notification count to client
    this.notificationGateway.sendNotificationToClients(unreadCount);
  }
}
