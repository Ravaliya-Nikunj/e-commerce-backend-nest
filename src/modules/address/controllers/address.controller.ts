import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dtos/create-address.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { AddressDto, AddressWithUserDto } from '../dtos/address.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums';
@ApiTags('Addresses')
@Controller({ path: 'address' })
@ApiExtraModels(ApiResponseDto, AddressDto, AddressWithUserDto)
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleType.USER, RoleType.SELLER)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new address' })
  @ApiOkResponse({
    description: 'Address created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(AddressDto),
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
  async create(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<ApiResponseDto<AddressDto>> {
    const address = await this.addressService.create(createAddressDto);
    return ApiResponseDto.success(address, 'Address created successfully');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all addresses for the current user' })
  @ApiOkResponse({
    description: 'Addresses fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(AddressWithUserDto),
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
  async findAll(): Promise<ApiResponseDto<AddressWithUserDto[]>> {
    const addresses = await this.addressService.findAll();
    return ApiResponseDto.success(addresses, 'Addresses fetched successfully');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiOkResponse({
    description: 'Address fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(AddressDto),
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
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<AddressDto>> {
    const address = await this.addressService.findOne(id);
    return ApiResponseDto.success(address, 'Address fetched successfully');
  }

  //   @Patch(':id')
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOperation({ summary: 'Update an address' })
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //     description: 'The address has been updated.',
  //     type: UserAddress,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_FOUND,
  //     description: 'Address not found',
  //   })
  //   async update(
  //     @Param('id', ParseUUIDPipe) id: string,
  //     @Body() updateAddressDto: UpdateAddressDto,
  //     @CurrentUser() user: JwtPayload,
  //   ): Promise<UserAddress> {
  //     return this.addressService.update(id, updateAddressDto, user.id);
  //   }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an address' })
  @ApiOkResponse({
    description: 'Address deleted successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {},
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
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponseDto<void>> {
    await this.addressService.remove(id);
    return ApiResponseDto.success(null, 'Address deleted successfully');
  }

  @Post(':id/set-default')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set address as default' })
  @ApiOkResponse({
    description: 'Address set as default successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(AddressDto),
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
  async setDefault(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<AddressDto>> {
    const result = await this.addressService.setDefaultAddress(id);
    return ApiResponseDto.success(result, 'default address set successfully.');
  }
}
