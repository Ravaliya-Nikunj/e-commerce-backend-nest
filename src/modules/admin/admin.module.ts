import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { UserRole } from '../user-roles/entities/user-role.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { RoleRepository } from '../role/repositories/role.repository';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRole])],
  controllers: [AuthController],
  providers: [AuthService, RoleRepository, UserRepository],
  exports: [AuthService],
})
export class AdminModule {}
