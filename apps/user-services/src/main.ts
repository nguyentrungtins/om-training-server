/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 8081
    }
  });
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
  Logger.log('🚀 User service is running!!!');
}

bootstrap();
