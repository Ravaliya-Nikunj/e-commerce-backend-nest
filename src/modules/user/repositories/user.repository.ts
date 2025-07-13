import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/modules/role/entities/role.entity';

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
  findAll = async (): Promise<User[]> => {
    return await this.userModel.findAll();
  };

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email },
    });
  }
}
