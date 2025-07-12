import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

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

  findByEmail = async (email: string): Promise<User | null> => {
    return await this.userModel.findOne({ where: { email } });
  };
}
