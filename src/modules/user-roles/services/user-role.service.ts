import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRole)
    private userModel: typeof UserRole,
  ) {}

  async findAll(): Promise<UserRole[]> {
    return this.userModel.findAll();
  }
}
