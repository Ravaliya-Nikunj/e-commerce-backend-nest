import { Controller, Get } from '@nestjs/common';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { RoleService } from '../services/role.service';

@Controller({
  path: 'roles',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll(): Promise<ApiResponseDto> {
    const roles = await this.roleService.findAll();
    return ApiResponseDto.success({ roles }, 'Roles fetched successfully');
  }
}
