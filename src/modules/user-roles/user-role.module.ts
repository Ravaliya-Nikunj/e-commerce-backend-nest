import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRole } from './entities/user-role.entity';
import { UserRoleService } from './services/user-role.service';
import { UserRoleController } from './controllers/user-role.controller';
import { UserRoleRepository } from './repositories/user-role.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserRole])],
  providers: [UserRoleService, UserRoleRepository],
  controllers: [UserRoleController],
  exports: [UserRoleService],
})
export class UserRoleModule {}
