import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserRole } from '../user-roles/entities/user-role.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtUtil } from '../../shared/utils/jwt.util';
import { BcryptUtil } from '../../shared/utils/bcrypt.util';
import { SharedModule } from '../../shared/shared.module';
import { RoleRepository } from '../role/repositories/role.repository';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole]),
    JwtModule.register({}),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RoleRepository, UserRepository, JwtUtil, BcryptUtil],
  exports: [AuthService],
})
export class AdminModule {}
