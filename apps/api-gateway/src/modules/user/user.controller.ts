import {
  Body,
  Controller,
  Get,
  Param,
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
import { PermissionGuard } from '../../shared/guards/permission/permission.guard';
import { HasPermission } from '../../shared/decorators/HasPermission.decorator';
import { Login } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findUser(@Query('email') email: string) {
    return this.userService.findUser(email);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  @UseGuards(PermissionGuard)
  @HasPermission('admin')
  findAll() {
    return this.userService.findAllUser();
  }

  @Post('/login')
  login(@Body() user: Login) {
    return this.userService.login(user);
  }

  @Get('/role-by-email')
  @UseGuards(JwtAuthGuard)
  findRoleByUserEmail(@Query('email') email: string) {
    return this.userService.getRoleByUserEmail(email);
  }

  @Patch('/update-role-permissions')
  @UseGuards(JwtAuthGuard)
  updateRolePermissions(@Body() role: updateRolePermissions) {
    return this.userService.updateRolePermissions(role);
  }
  @Patch('/update-user-role')
  @UseGuards(JwtAuthGuard)
  updateUserRole(@Body() newRole: updateUserRole) {
    return this.userService.updateUserRole(newRole);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
  @Post('role/create')
  @UseGuards(JwtAuthGuard)
  createRole(@Body() role: CreateRoleDto) {
    return this.userService.createRole(role);
  }
  @Get('role')
  @UseGuards(JwtAuthGuard)
  findAllRole() {
    return this.userService.findAllRole();
  }

  @Post('permission/create')
  @UseGuards(JwtAuthGuard)
  createPermistion(@Body() permission: CreatePermissionDto) {
    return this.userService.createPermission(permission);
  }

  @Get('test-websocket')
  testWebsocket(@Query('id') id: any) {
    return this.userService.testWebsocket(id);
  }
}
