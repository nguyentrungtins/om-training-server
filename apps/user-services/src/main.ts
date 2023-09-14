import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['POST'],
    credentials: true,
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 8081,
    },
  });
  app.setGlobalPrefix('api/v1');
  app.startAllMicroservices();
  await app.listen(8082);
  Logger.log('🚀 Application is running on: http://localhost:' + 8082);
}
bootstrap();
