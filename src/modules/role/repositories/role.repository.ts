import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }
}
