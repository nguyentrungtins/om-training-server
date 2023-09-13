import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { updateRolePermissions } from './dto/update-permision-role.dto';
import { updateUserRole } from './dto/update-user-role.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findUser(@Query('email') email: string) {
    return this.userService.findUser(email);
  }

  @Get('/all')
  findAll() {
    return this.userService.findAllUser();
  }

  @Get('/role-by-email')
  findRoleByUserEmail(@Query('email') email: string) {
    return this.userService.getRoleByUserEmail(email);
  }

  @Patch('/update-role-permissions')
  updateRolePermissions(@Body() role: updateRolePermissions) {
    return this.userService.updateRolePermissions(role);
  }
  @Patch('/update-user-role')
  updateUserRole(@Body() newRole: updateUserRole) {
    return this.userService.updateUserRole(newRole);
  }

  @Post('create')
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
  @Post('role/create')
  createRole(@Body() role: CreateRoleDto) {
    return this.userService.createRole(role);
  }
  @Get('role')
  findAllRole() {
    return this.userService.findAllRole();
  }

  @Post('permission/create')
  createPermistion(@Body() permission: CreatePermissionDto) {
    return this.userService.createPermission(permission);
  }
}
