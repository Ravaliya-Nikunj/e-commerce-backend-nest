// src/common/guards/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtUtil } from '../../shared/utils/jwt.util';
import { LoggingService } from '../../logging/logging.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtUtil: JwtUtil,
    private loggerService: LoggingService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      this.loggerService.error('No Token provided.');
      throw new UnauthorizedException('Unauthorized.');
    }
    const parts = authHeader.split(' ');
    if (parts.length != 2) {
      this.loggerService.error('Token error.');
      throw new UnauthorizedException('Unauthorized.');
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      this.loggerService.error('Invalid token scheme.');
      throw new UnauthorizedException('Unauthorized.');
    }
    try {
      const decoded = this.jwtUtil.verifyToken(token);
      request.user = decoded; // Inject user
      return true;
    } catch (error) {
      this.loggerService.error('Invalid token.', error);
      throw new UnauthorizedException('Unauthorized.');
    }
  }
}
