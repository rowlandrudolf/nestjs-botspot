import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = ctx.switchToHttp().getRequest().user;
    if (user) {
      return true;
    }
    throw new UnauthorizedException('Not authorized');
  }
}
