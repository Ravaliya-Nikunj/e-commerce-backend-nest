import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { InjectModel } from '@nestjs/sequelize';
import { UserRole } from 'src/modules/user-roles/entities/user-role.entity';
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

  getRoleByUserId = async (userId: string): Promise<Role> => {
    const role = await this.roleModel.findOne({
      include: [
        {
          model: UserRole,
          as: 'userRole', // This should match the alias in the @HaOne decorator
          where: { userId },
          required: true,
        },
      ],
    });

    if (!role) {
      throw new BadRequestException('Role not found for user');
    }

    return role;
  };
}
