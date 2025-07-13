import { Module } from '@nestjs/common';
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

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRole])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    RoleService,
    RoleRepository,
    UserRoleService,
    UserRoleRepository,
  ],
  exports: [],
})
export class AuthModule {}
