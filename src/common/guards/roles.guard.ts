import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../modules/role/entities/role.entity';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private loggerService: LoggingService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    this.loggerService.log('Required roles: ', requiredRoles);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      this.loggerService.warn('Access denied: insufficient role');
      throw new ForbiddenException('Access denied');
    }
    this.loggerService.log('Access granted');
    return true;
  }
}
