import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRole } from './entities/user-role.entity';
import { UserRoleService } from './services/user-role.service';
import { UserRoleController } from './controllers/user-role.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserRole])],
  providers: [UserRoleService],
  controllers: [UserRoleController],
})
export class UserRoleModule {}
