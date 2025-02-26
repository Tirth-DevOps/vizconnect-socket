import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { Transport } from '@nestjs/microservices';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true })); // Enable validation
  app.useGlobalFilters(new AllExceptionsFilter());
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL], // RabbitMQ URL
      queue: 'orders_queue', // Same queue name
      queueOptions: {
        durable: false,
      },
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'notification_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

 app.enableCors(); // Enable CORS
  await app.startAllMicroservices();
  console.log('✅ Microservices started: Listening to orders_queue & notification_queue');
  await app.listen(process.env.PORT,()=>{
    console.log(`Server started on http://localhost:${process.env.PORT}`);
  });
}
bootstrap();
