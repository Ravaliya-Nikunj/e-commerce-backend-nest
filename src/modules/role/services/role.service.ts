import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  findAll = (): Promise<Role[]> => {
    return this.roleRepository.findAll();
  };

  findByName = (name: string): Promise<Role> => {
    return this.roleRepository.findByName(name);
  };
}
