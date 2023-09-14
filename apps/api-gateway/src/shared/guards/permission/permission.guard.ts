import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'apps/api-gateway/src/modules/user/user.service';
import { decode } from 'next-auth/jwt';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );
    const request = context.switchToHttp().getRequest();
    const reqMethod = request.method as string;
    const authHeader = request.headers.authorization;

    console.log('Required Permission', requiredPermissions);
    if (!requiredPermissions) {
      return true; // No permissions required, allow access
    }
    const email = await this.getUserEmail(authHeader);

    if (
      await this.checkUserHasPermission(
        email,
        requiredPermissions,
        reqMethod.toLowerCase()
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
  private async checkUserHasPermission(
    email: string | null,
    permissions: string[],
    method: string
  ) {
    const isUserHasPermission = await this.userService.checkUserPermission({
      email,
      roles: permissions,
      permissions: method,
    });
    return isUserHasPermission;
  }
  private async getUserEmail(authHeader: string) {
    // console.log()

    // console.log('cookies: ', request.headers.cookie);
    // const authHeader = request.cookies['next-auth.session-token'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = await decode({
          token: token,
          secret: 'nguyentrungtin',
        });

        if (decoded.email) {
          return decoded.email;
        } else {
          throw new ForbiddenException('Invalid User');
        }
      } catch (error) {
        throw new ForbiddenException('Invalid User');
      }
    }
    return null;
  }
}
