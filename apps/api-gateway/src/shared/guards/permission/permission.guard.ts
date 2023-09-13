import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, Permission } from '../../entities';
import { UserService } from '../../../modules/user/user.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService // Inject your role service
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<Permission[]>(
      'permissions',
      context.getClass()
    );

    if (!requiredPermissions) {
      return true; // No required permissions defined, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming you have user information attached to the request

    const userRole = await this.userService.(user.role); // Fetch the user's role from the database

    if (!userRole) {
      return false; // Invalid user role, deny access
    }

    const userPermissions = userRole.permissions; // Assuming the role object has a 'permissions' property

    if (!userPermissions) {
      return false; // Invalid user role permissions, deny access
    }

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    return hasPermission;
  }
}
