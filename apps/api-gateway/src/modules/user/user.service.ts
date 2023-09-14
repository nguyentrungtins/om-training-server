import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { User } from '../../shared/entities/User.entity';
import { Role } from '../../shared/entities/Role.entity';
import { Permission } from '../../shared/entities/Permission.entity';
// import * as bcrypt from 'bcrypt';
import { updateRolePermissions } from './dto/update-permision-role.dto';
import { updateUserRole } from './dto/update-user-role.dto';
import { CheckUserPermission } from './dto/check-user-permission.dto';
import { Login } from './dto/login.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE_TCP') private readonly userClient: ClientProxy,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  helloUser() {
    return this.userClient
      .send({ cmd: 'hello_user_tcp' }, { message: 'hello from gateway' })
      .toPromise();
  }

  async findUser(email: string) {
    return await this.userRepository.findBy({ email: email });
  }

  async login(user: Login) {
    const findUser = await this.userRepository.findOneBy({
      email: user.email,
      password: user.password,
    });
    if (!findUser) {
      return new NotFoundException('Invalid Credential');
    }
    const roleList = findUser.roles.map((role) => {
      return role.name;
    });
    const userFilterd = {
      email: findUser.email,
      role: roleList,
      name: findUser.name,
      id: findUser.id,
    };
    return userFilterd;
  }

  async findAllUser() {
    const users = await this.userRepository.find();

    const userDataFiltered = [];
    users.map((user) => {
      let permissions = [];
      const roles = user.roles.map((role) => {
        permissions = role.permissions.map((permission) => {
          return permission.name;
        });

        return role.name;
      });
      const userItemAfterFiltering = {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: roles,
        permissions: permissions,
        status: user.status,
        create_at: user.created_at,
      };
      userDataFiltered.push(userItemAfterFiltering);
    });
    return userDataFiltered;
  }

  async createUser(user: CreateUserDto) {
    let newUser = new User();
    const roles = await this.roleRepository.findBy({ name: In(user.roles) });
    newUser = { ...user, id: newUser.id, roles: roles };
    return this.userRepository.save(newUser);
  }

  async checkUserPermission(userCredential: CheckUserPermission) {
    try {
      // const roles = await this.getRoleByUserEmail('admin@gmail.com');
      console.log('email: ', userCredential.email);
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

  async findAllRole() {
    const roles = await this.roleRepository.find();
    const roleDataAfterFiltering = [];
    if (roles) {
      roles.map((role) => {
        const permissions = role.permissions.map((permission) => {
          return permission.name;
        });
        const roleItemFiltering = {
          name: role.name,
          permissions,
        };
        roleDataAfterFiltering.push(roleItemFiltering);
      });
    }
    console.log(roles);
    return roleDataAfterFiltering;
  }

  async getRoleByUserEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.email = :email', { email })
      .getOne();
    return user.roles;
  }

  async createRole(role: CreateRoleDto) {
    let newRole = new Role();
    newRole = { ...role, id: newRole.id };
    return this.roleRepository.save(newRole);
  }
  async updateUserRole(newRole: updateUserRole) {
    const user = await this.userRepository.findOneBy({
      id: newRole.id,
    });
    const roleList = await this.roleRepository.findBy({
      name: In(newRole.roles),
    });
    return this.roleRepository
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(user)
      .addAndRemove(roleList, user.roles);
  }

  async updateRolePermissions(newRole: updateRolePermissions) {
    const role = await this.roleRepository.findOneBy({
      name: newRole.name,
    });
    const permisions = await this.permissionRepository.findBy({
      name: In(newRole.permissions),
    });
    return this.roleRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(role)
      .addAndRemove(permisions, role.permissions);
  }

  createPermission(permission: CreatePermissionDto) {
    let newPermission = new Permission();
    newPermission = { ...permission, id: newPermission.id };
    return this.permissionRepository.save(newPermission);
  }
}
