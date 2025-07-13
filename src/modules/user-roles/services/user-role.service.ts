import { Injectable } from '@nestjs/common';
import { UserRole } from '../entities/user-role.entity';
import { UserRoleRepository } from '../repositories/user-role.repository';

@Injectable()
export class UserRoleService {
  constructor(private readonly userRoleRepository: UserRoleRepository) {}

  create = async (userRole: UserRole, transaction?: any): Promise<UserRole> => {
    return await this.userRoleRepository.create(userRole, transaction);
  };
  findAll = async (): Promise<UserRole[]> => {
    return await this.userRoleRepository.findAll();
  };
}
