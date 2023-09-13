import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../infrastructure/config/typeorm.service';
import { UserModule } from '../modules/user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CommonResponseInterceptor } from '../shared/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [TypeOrmConfigService]
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE_TCP',
        transport: Transport.TCP,
        options: {
          port: 8081
        }
      },
      {
        name: 'NOTI_SERVICE_TCP',
        transport: Transport.TCP,
        options: {
          port: 8082
        }
      }
    ]),
    UserModule
  ],
  controllers: [],
  providers: [
    TypeOrmConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CommonResponseInterceptor
    }
  ]
})
export class AppModule {}
