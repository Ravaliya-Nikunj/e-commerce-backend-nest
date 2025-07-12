import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EmailSignUpDto } from '../dtos/email-sign-up.dto';
import { UserService } from '../../user/services/user.service';
import { RoleService } from '../../role/services/role.service';
import { UserRoleService } from '../../user-roles/services/user-role.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sequelize: Sequelize,
  ) {}

  doSignUp = async (dto: EmailSignUpDto) => {
    const transaction = await this.sequelize.transaction();
    try {
      console.log('Transaction started');
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  };
}
