import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';
import { config } from 'dotenv';
import * as entities from '../../shared/entities';
config();

const configService = new ConfigService();

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log('path: ', join(__dirname));
    return {
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: configService.get('POSTGRES_PORT'),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DATABASE'),
      entities: entities,
      synchronize: false,
      migrationsRun: true,
      logging: true,
      migrationsTableName: 'migrations',
      migrations: [join(__dirname, './database/migrations/*.ts')],
    };
  }
}
