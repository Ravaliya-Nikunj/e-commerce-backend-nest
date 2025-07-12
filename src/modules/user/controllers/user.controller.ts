import { Controller, Get } from '@nestjs/common';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';

@Controller({
  path: 'users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ApiResponseDto<UserDto[]>> {
    const users = await this.userService.findAll();
    return ApiResponseDto.success({ users }, 'Users fetched successfully');
  }
}
