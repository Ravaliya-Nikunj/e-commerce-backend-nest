import {
  Controller,
  Get,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  imageFileFilter,
  profileImageSizeLimit,
} from '../../../helpers/file-upload.util';
import { UpdateUserDto } from '../../auth/dtos/update-user.dto';
@ApiTags('Users')
@Controller({
  path: 'user',
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

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user information' })
  @ApiOkResponse({
    description: 'Successfully retrieved user information',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserDto) },
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
  @Roles(RoleType.USER, RoleType.SELLER)
  async getCurrentUser(): Promise<ApiResponseDto<UserDto>> {
    const userDto = await this.userService.getUserDetails();

    return ApiResponseDto.success(
      userDto,
      'User information retrieved successfully',
    );
  }
  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: profileImageSizeLimit,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @Roles(RoleType.USER, RoleType.SELLER)
  @ApiOperation({ summary: 'Update profile' })
  @ApiOkResponse({
    description: 'Successfully updated profile',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserDto) },
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
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<UserDto>> {
    const updatedUser = await this.userService.updateProfile(
      updateUserDto,
      file,
    );
    return ApiResponseDto.success(updatedUser, 'Profile updated successfully');
  }
}
