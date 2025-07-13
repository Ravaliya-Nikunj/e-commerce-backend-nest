import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtUtil {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(payload: any): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, isRefreshToken: true },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  verifyToken(token: string, isRefreshToken = false): any {
    try {
      return this.jwtService.verify(token, {
        secret: isRefreshToken
          ? this.configService.get('JWT_REFRESH_SECRET')
          : this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw error;
    }
  }
}
