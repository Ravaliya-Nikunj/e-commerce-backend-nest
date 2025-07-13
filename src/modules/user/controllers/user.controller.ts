import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleType } from 'src/common/enums';

@Controller({
  path: 'users',
})
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  async findAll(): Promise<ApiResponseDto<UserDto[]>> {
    const users = await this.userService.findAll();
    return ApiResponseDto.success({ users }, 'Users fetched successfully');
  }
}
