import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';
import { UserRole } from '../../user-roles/entities/user-role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Role)
    private roleModel: typeof Role,
    @InjectModel(UserRole)
    private userRoleModel: typeof UserRole,
  ) {}

  async doSignUp(registerDto: any) {
    return 'singup';
  }
}
