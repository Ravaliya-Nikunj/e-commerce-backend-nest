import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  findAll = async (): Promise<Role[]> => {
    return await this.roleRepository.findAll();
  };

  findByName = async (name: string): Promise<Role> => {
    return await this.roleRepository.findByName(name);
  };

  getRoleByUserId = async (userId: string): Promise<Role> => {
    return await this.roleRepository.getRoleByUserId(userId);
  };
}
