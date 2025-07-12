import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  findAll = (): Promise<Role[]> => {
    return this.roleModel.findAll();
  };

  findByName = async (name: string): Promise<Role> => {
    const role = await this.roleModel.findOne({ where: { name } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return role;
  };
}
