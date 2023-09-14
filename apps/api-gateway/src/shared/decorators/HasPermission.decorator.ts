import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const HasPermission = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

export const GetPermissions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.permissions;
  }
);
