import { Controller, Get } from '@nestjs/common';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { UserRoleService } from '../services/user-role.service';

@Controller({
  path: 'user-roles',
  version: '1',
})
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Get()
  async findAll(): Promise<ApiResponseDto> {
    const userRoles = await this.userRoleService.findAll();
    return ApiResponseDto.success(
      { userRoles },
      'User roles fetched successfully',
    );
  }
}
