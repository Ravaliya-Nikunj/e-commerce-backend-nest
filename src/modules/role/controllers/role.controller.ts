import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { RoleService } from '../services/role.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums';
import {
  ApiResponse,
  ApiOperation,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { RoleDto } from '../dtos/role.dto';

@Controller({
  path: 'roles',
  version: '1',
})
@ApiExtraModels(ApiResponseDto, RoleDto)
@UseGuards(AuthGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Retrieves a list of roles. Requires admin privileges.',
  })
  @ApiOkResponse({
    description: 'Roles fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                roles: {
                  type: 'array',
                  items: { $ref: getSchemaPath(RoleDto) },
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
  async findAll(): Promise<ApiResponseDto<RoleDto[]>> {
    const roles = await this.roleService.findAll();
    return ApiResponseDto.success({ roles }, 'Roles fetched successfully');
  }
}
