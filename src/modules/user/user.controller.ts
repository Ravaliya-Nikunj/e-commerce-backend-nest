import { Controller, Get } from '@nestjs/common';
import { ApiResponseDto } from '../../common/dtos/api-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ApiResponseDto> {
    const users = await this.userService.findAll();
    return ApiResponseDto.success({ users }, 'Users fetched successfully');
  }
}
