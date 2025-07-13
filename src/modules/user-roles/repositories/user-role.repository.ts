import { Injectable } from '@nestjs/common';
import { UserRole } from '../entities/user-role.entity';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class UserRoleRepository {
  constructor(
    @InjectModel(UserRole)
    private userRoleModel: typeof UserRole,
  ) {}

  create = async (userRole: UserRole, transaction?: any): Promise<UserRole> => {
    return await this.userRoleModel.create(userRole, { transaction });
  };
}
