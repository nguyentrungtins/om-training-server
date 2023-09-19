import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
// import * as bcrypt from 'bcrypt';
import { updateRolePermissions } from './dto/update-permision-role.dto';
import { updateUserRole } from './dto/update-user-role.dto';
import { CheckUserPermission } from './dto/check-user-permission.dto';
import { Login } from './dto/login.dto';
import { WebSocketEventGateway } from '../gateway/websocket';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE_TCP') private readonly userClient: ClientProxy,
    private readonly websocketClient: WebSocketEventGateway
  ) {}

  async findUser(email: string) {
    try {
      return await this.userClient
        .send({ cmd: 'user.find' }, { email })
        .toPromise();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Error when find user infomations by email',
        {
          cause: new Error(),
          description: 'Email not found!',
        }
      );
    }
  }

  async login(user: Login) {
    try {
      return this.userClient.send({ cmd: 'user.login' }, { user }).toPromise();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error when login with credential', {
        cause: new Error(),
        description: 'Invalid credential!',
      });
    }
  }
  async testWebsocket(id: string) {
    return this.websocketClient.handleEmitSocket({
      data: id,
      event: 'force-reload',
      to: 'admin@gmail.com',
    });
  }
  async findAllUser() {
    try {
      return this.userClient.send({ cmd: 'user.find.all' }, {}).toPromise();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Find all user error occur!',
      });
    }
  }

  async createUser(user: CreateUserDto) {
    try {
      return this.userClient.send({ cmd: 'user.create' }, { user }).toPromise();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Error occur when creating user!',
      });
    }
  }

  async findAllRole() {
    try {
      return this.userClient.send({ cmd: 'user.find.role' }, {}).toPromise();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Error occur when find all role!',
      });
    }
  }

  async getRoleByUserEmail(email: string) {
    try {
      return this.userClient
        .send({ cmd: 'user.find.role-by-email' }, { email })
        .toPromise();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Error occur when find role by user email!',
      });
    }
  }

  async createRole(role: CreateRoleDto) {
    try {
      return this.userClient
        .send({ cmd: 'user.create.role' }, { role })
        .toPromise();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Error occur when creating role!',
      });
    }
  }
  async updateUserRole(newRole: updateUserRole) {
    try {
      return this.userClient
        .send({ cmd: 'user.update.role' }, { newRole })
        .toPromise();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Error occur when updating role!',
      });
    }
  }

  async updateRolePermissions(newRole: updateRolePermissions) {
    try {
      return this.userClient
        .send({ cmd: 'user.update.permission' }, { newRole })
        .toPromise();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Error occur when updating permission!',
      });
    }
  }

  createPermission(permission: CreatePermissionDto) {
    try {
      return this.userClient
        .send({ cmd: 'user.create.permission' }, { permission })
        .toPromise();
    } catch (error) {
      throw new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Error occur when creating permission!',
      });
    }
  }

  async checkUserPermission(userCredential: CheckUserPermission) {
    try {
      // const roles = await this.getRoleByUserEmail('admin@gmail.com');
      console.log(userCredential.email);
      const roles = await this.getRoleByUserEmail(userCredential.email);
      console.log('role', this.getRoleByUserEmail);

      if (!roles) {
        return false; // User dont have any permission
      }
      const roleList = roles.map((role) => {
        return role.name;
      });
      const isUserValid = userCredential.roles.every((r) =>
        roleList.includes(r)
      );
      if (!isUserValid) {
        return false; // User dont have enough access role
      }
      const permissionList = roles.map((role) => {
        return role.permissions.map((permission) => {
          return permission.name;
        });
      });
      const flattenedArray = permissionList.flat();
      const permissionListFilterd = [...new Set(flattenedArray)];
      const userPermissionValid = permissionListFilterd.includes(
        userCredential.permissions
      );
      return userPermissionValid;
    } catch {
      return false;
    }
  }
}
