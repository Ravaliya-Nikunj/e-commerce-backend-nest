import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { RoleService } from '../services/role.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums';

@Controller({
  path: 'roles',
  version: '1',
})
@UseGuards(AuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  async findAll(): Promise<ApiResponseDto> {
    const roles = await this.roleService.findAll();
    return ApiResponseDto.success({ roles }, 'Roles fetched successfully');
  }
}
