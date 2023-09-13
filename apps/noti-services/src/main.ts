import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
async function bootstrap() {
  config();

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'noti',
        brokers: [process.env.KAFKA_BROKER]
      },
      consumer: {
        groupId: 'noti-consumer'
      }
    }
  });

  await app.startAllMicroservices().then(() => {
    Logger.log('Kafka of User Service is running!');
  });
  Logger.log('🚀 Notification service is running!!! ');
}

bootstrap();
