// src/common/services/context.service.ts
import { Injectable, Scope, Inject, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
declare module 'express' {
  interface Request {
    user?: {
      sub: string;
      email: string;
      role: string;
      roleId: string;
    };
  }
}
@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getEmail(): string {
    if (!this.request.user) {
      throw new BadRequestException('user not found');
    }
    return this.request.user?.email;
  }

  getRole(): string {
    if (!this.request.user) {
      throw new BadRequestException('user not found');
    }
    return this.request.user?.role;
  }

  getRoleId(): string {
    if (!this.request.user) {
      throw new BadRequestException('user not found');
    }
    return this.request.user?.roleId;
  }

  getUserId(): string {
    if (!this.request.user) {
      throw new BadRequestException('user not found');
    }
    return this.request.user?.sub;
  }
}
