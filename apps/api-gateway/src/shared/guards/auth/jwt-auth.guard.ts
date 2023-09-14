import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { decode } from 'next-auth/jwt';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    // console.log('cookies: ', request.headers.cookie);
    // const authHeader = request.cookies['next-auth.session-token'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = await decode({
          token: token,
          secret: 'nguyentrungtin',
        });

        if (!decoded || !decoded.exp) {
          return false;
        } else if (decoded.exp) {
          const expirationTimestamp = Number(decoded.exp) * 1000; // Convert to milliseconds
          console.log(expirationTimestamp);
          const currentTimestamp = Date.now();
          return currentTimestamp < expirationTimestamp;
        }
      } catch (error) {
        return false;
      }
    }
  }
}
