import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';
import { Role } from '../entities/role.entity';
import { RoleDto } from '../dtos/role.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  findAll = async (): Promise<RoleDto[]> => {
    const roles = await this.roleRepository.findAll();
    return roles.map((role) =>
      plainToClass(RoleDto, role, {
        excludeExtraneousValues: true,
      }),
    );
  };

  findByName = async (name: string): Promise<RoleDto> => {
    const role = await this.roleRepository.findByName(name);
    return plainToClass(RoleDto, role, {
      excludeExtraneousValues: true,
    });
  };

  getRoleByUserId = async (userId: string): Promise<RoleDto> => {
    const role = await this.roleRepository.getRoleByUserId(userId);
    return plainToClass(RoleDto, role, {
      excludeExtraneousValues: true,
    });
  };
}
