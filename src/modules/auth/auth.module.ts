import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserRole } from '../user-roles/entities/user-role.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/services/user.service';
import { UserRepository } from '../user/repositories/user.repository';
import { RoleService } from '../role/services/role.service';
import { UserRoleService } from '../user-roles/services/user-role.service';
import { RoleRepository } from '../role/repositories/role.repository';
import { UserRoleRepository } from '../user-roles/repositories/user-role.repository';
import { LoggingModule } from '../../logging/logging.module';
import { SharedModule } from 'src/shared/shared.module';
import { JwtUtil } from '../../shared/utils/jwt.util';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRES_IN') || '1h',
        },
      }),
      inject: [ConfigService],
    }),
    LoggingModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    RoleService,
    RoleRepository,
    UserRoleService,
    JwtUtil,
    UserRoleRepository,
  ],
  exports: [],
})
export class AuthModule {}
