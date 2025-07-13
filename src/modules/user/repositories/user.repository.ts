import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from '../entities/user.entity';
import { Role } from '../../../modules/role/entities/role.entity';
import { UserRole } from '../../../modules/user-roles/entities/user-role.entity';
import { RoleType } from '../../../common/enums';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(userData: User, transaction?: Transaction): Promise<User> {
    const user = await this.userModel.create(userData, { transaction });
    return user;
  }
  async findAll(excludeAdmins: boolean = true): Promise<User[]> {
    const options = {
      include: [
        {
          model: UserRole,
          as: 'userRole',
          required: excludeAdmins,
          include: [
            {
              model: Role,
              as: 'role',
              where: { name: { [Op.ne]: RoleType.ADMIN } },
            },
          ],
        },
      ],
    };

    return await this.userModel.findAll(options);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email },
    });
  }
}
