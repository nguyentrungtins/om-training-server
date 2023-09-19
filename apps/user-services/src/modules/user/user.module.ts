import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/User.entity';
import { Role } from '../../shared/entities/Role.entity';
import { Permission } from '../../shared/entities/Permission.entity';
import { UserRepository } from './repositories/user.repository';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthRepository],
  exports: [UserService],
})
export class UserModule {}
