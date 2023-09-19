import { Controller, Header } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { updateRolePermissions } from './dto/update-permision-role.dto';
import { updateUserRole } from './dto/update-user-role.dto';
import { Login } from './dto/login.dto';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'user.find' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  async findUser(@Payload('email') email: string) {
    const user = await this.userService.findUser(email);
    return user;
  }

  @MessagePattern({ cmd: 'user.login' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  login(@Payload('user') user: Login) {
    return this.userService.login(user);
  }

  @MessagePattern({ cmd: 'user.find.all' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  findAll() {
    return this.userService.findAllUser();
  }

  @MessagePattern({ cmd: 'user.find.role-by-email' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  findRoleByUserEmail(@Payload('email') email: string) {
    return this.userService.getRoleByUserEmail(email);
  }

  @MessagePattern({ cmd: 'user.update.permission' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  updateRolePermissions(@Payload('newRole') role: updateRolePermissions) {
    console.log(role);
    return this.userService.updateRolePermissions(role);
  }

  @MessagePattern({ cmd: 'user.update.role' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  updateUserRole(@Payload('newRole') newRole: updateUserRole) {
    return this.userService.updateUserRole(newRole);
  }

  @MessagePattern({ cmd: 'user.create' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  createUser(@Payload('user') user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @MessagePattern({ cmd: 'user.create.role' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  createRole(@Payload('user') role: CreateRoleDto) {
    return this.userService.createRole(role);
  }

  @MessagePattern({ cmd: 'user.find.role' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  findAllRole() {
    return this.userService.findAllRole();
  }

  @MessagePattern({ cmd: 'user.create.permission' }, Transport.TCP)
  @Header('Content-Type', 'application/json')
  createPermistion(@Payload('permission') permission: CreatePermissionDto) {
    return this.userService.createPermission(permission);
  }
}
