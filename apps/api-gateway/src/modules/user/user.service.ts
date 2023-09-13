import { Inject, Injectable } from '@nestjs/common';

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
    console.log('im here');
    return this.userClient
      .send({ cmd: 'hello_user_tcp' }, { message: 'hello from gateway' })
      .toPromise();
  }

  async findUser(email: string) {
    return await this.userRepository.findBy({ email: email });
  }

  async findAllUser() {
    const users = await this.userRepository.find();

    let userDataFiltered = [];
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

  async findAllRole() {
    const roles = await this.roleRepository.find();
    let roleDataAfterFiltering = [];
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
