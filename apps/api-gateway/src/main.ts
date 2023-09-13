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
  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 8080,
    },
  });
  app.setGlobalPrefix('api/v1');
  await app.startAllMicroservices();
  await app.listen(8090);
  Logger.log('🚀 Application is running on: http://localhost:' + 8090);
}

bootstrap();
