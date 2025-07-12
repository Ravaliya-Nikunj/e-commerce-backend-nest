import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { RoleRepository } from './repositories/role.repository';

@Module({
  imports: [SequelizeModule.forFeature([Role])],
  providers: [RoleService, RoleRepository],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
