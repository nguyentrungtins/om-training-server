import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from '../kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ClientsModule.register([
      {
        name: 'NOTI_SERVICE_KAFKA',
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
      }
    ]),
    KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
