import { Injectable } from '@nestjs/common';
import { UserRole } from '../entities/user-role.entity';
import { UserRoleRepository } from '../repositories/user-role.repository';

@Injectable()
export class UserRoleService {
  constructor(private readonly userRoleRepository: UserRoleRepository) {}

  async findAll(): Promise<UserRole[]> {
    return this.userRoleRepository.findAll();
  }
}
