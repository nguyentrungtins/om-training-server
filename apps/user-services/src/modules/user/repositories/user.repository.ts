import { EntityRepository, In, Repository } from 'typeorm';
import { User } from '../../../shared/entities/User.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../../../shared/entities/Role.entity';
import { Permission } from '../../../shared/entities/Permission.entity';
import { updateUserRole } from '../dto/update-user-role.dto';
import { updateRolePermissions } from '../dto/update-permision-role.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}
  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email: email });
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'This is a custom message',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: 'Invalid Email',
          }
        );
      }
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
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

  async getRoleByUserEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.email = :email', { email })
      .getOne();
    return user.roles;
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
    return roleDataAfterFiltering;
  }

  async findAllUser() {
    try {
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
    } catch (error) {
      throw new NotFoundException();
    }
  }
  async addUser(user: CreateUserDto) {
    let newUser = new User();
    const roles = await this.roleRepository.findBy({ name: In(user.roles) });
    newUser = { ...user, id: newUser.id, roles: roles };
    return this.userRepository.save(newUser);
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

  async createRole(role: CreateRoleDto) {
    let newRole = new Role();
    newRole = { ...role, id: newRole.id };
    return this.roleRepository.save(newRole);
  }
  async createPermission(permission: CreatePermissionDto) {
    let newPermission = new Permission();
    newPermission = { ...permission, id: newPermission.id };
    return await this.permissionRepository.save(newPermission);
  }
  // Add other methods for interacting with the User entity
}
