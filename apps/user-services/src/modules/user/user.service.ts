import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

// import * as bcrypt from 'bcrypt';
import { updateRolePermissions } from './dto/update-permision-role.dto';
import { updateUserRole } from './dto/update-user-role.dto';
import { CheckUserPermission } from './dto/check-user-permission.dto';
import { Login } from './dto/login.dto';
import { UserRepository } from './repositories/user.repository';
import { AuthRepository } from './repositories/auth.repository';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository
  ) {}

  async findUser(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async login(user: Login) {
    return await this.authRepository.login(user.email, user.password);
  }

  async findAllUser() {
    return await this.userRepository.findAllUser();
  }

  async createUser(user: CreateUserDto) {
    return this.userRepository.addUser(user);
  }

  async findAllRole() {
    return await this.userRepository.findAllRole();
  }

  async getRoleByUserEmail(email: string) {
    return await this.userRepository.getRoleByUserEmail(email);
  }

  async createRole(role: CreateRoleDto) {
    return await this.userRepository.createRole(role);
  }
  async updateUserRole(newRole: updateUserRole) {
    return await this.userRepository.updateUserRole(newRole);
  }

  async updateRolePermissions(newRole: updateRolePermissions) {
    return await this.userRepository.updateRolePermissions(newRole);
  }

  async createPermission(permission: CreatePermissionDto) {
    return await this.userRepository.createPermission(permission);
  }

  async checkUserPermission(userCredential: CheckUserPermission) {
    try {
      // const roles = await this.getRoleByUserEmail('admin@gmail.com');
      const roles = await this.getRoleByUserEmail(userCredential.email);

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
        return false; // User dont have enough role
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
