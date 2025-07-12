import { Controller, Get } from '@nestjs/common';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { UserService } from '../services/user.service';

@Controller({
  path: 'users',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ApiResponseDto> {
    const users = await this.userService.findAll();
    return ApiResponseDto.success({ users }, 'Users fetched successfully');
  }
}
