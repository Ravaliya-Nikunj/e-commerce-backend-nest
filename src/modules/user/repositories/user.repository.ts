import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }
}
