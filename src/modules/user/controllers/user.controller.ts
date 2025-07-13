import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums';

@ApiTags('Users')
@Controller({
  path: 'users',
})
@ApiExtraModels(ApiResponseDto, UserDto)
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of users. Requires admin privileges.',
  })
  @ApiQuery({
    name: 'includeAdmins',
    required: false,
    type: Boolean,
    description: 'Set to true to include admin users in the results',
  })
  @ApiOkResponse({
    description: 'Users fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: { $ref: getSchemaPath(UserDto) },
                },
              },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid token',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Access denied',
    type: ApiResponseDto,
  })
  async findAll(
    @Query('includeAdmins') includeAdmins?: string,
  ): Promise<ApiResponseDto<UserDto[]>> {
    const includeAdminsBool = includeAdmins?.toLowerCase() === 'true';
    const users = await this.userService.findAll(includeAdminsBool);
    return ApiResponseDto.success({ users }, 'Users fetched successfully');
  }
}
