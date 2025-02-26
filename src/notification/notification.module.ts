import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseService } from 'src/database/database.service';
import { NotificationGateway } from './notification.gatway';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_MICROSERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'user_auth_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ])
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway, DatabaseService], // Ensure OrderConsumer is here
})
export class NotificationModule {}
