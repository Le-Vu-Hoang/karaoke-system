//? Role guard

import { CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ROLE_KEY } from '../decorations/role.decorator';
import { RequestWithUser } from '../../modules/auth/interfaces/req-w-user.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest<RequestWithUser>().user;
    return requiredRoles.some((role) => user.role === role);
  }
}
