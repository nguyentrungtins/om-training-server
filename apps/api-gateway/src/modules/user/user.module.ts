import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../shared/guards/auth/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/User.entity';
import { Role } from '../../shared/entities/Role.entity';
import { Permission } from '../../shared/entities/Permission.entity';
import { PermissionsModule } from '../permissions/permission.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Role, Permission]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE_TCP',
        transport: Transport.TCP,
        options: {
          port: 8081,
        },
      },
      {
        name: 'NOTI_SERVICE_TCP',
        transport: Transport.TCP,
        options: {
          port: 8082,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard, PermissionsModule],
  exports: [JwtAuthGuard, UserService],
})
export class UserModule {}
