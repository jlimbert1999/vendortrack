import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators';
import { Users } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()]);
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user: Users = request['user'];
    if (!user) throw new InternalServerErrorException('user not found in request');
    return roles.some((role) => user.roles.includes(role));
  }
}
