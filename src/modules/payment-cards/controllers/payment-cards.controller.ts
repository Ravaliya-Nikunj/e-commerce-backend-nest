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
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums';
import { PaymentCardsService } from '../services/payment-cards.service';
import { CreateCardDto } from '../dtos/create-card.dto';
import { UpdateCardDto } from '../dtos/update-card.dto';
import {
  PaymentCardDto,
  PaymentCardWithUserDto,
} from '../dtos/payment-card.dto';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';

@ApiTags('Payment Cards')
@Controller({ path: 'payment-cards' })
@ApiExtraModels(ApiResponseDto, PaymentCardDto, PaymentCardWithUserDto)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(RoleType.USER, RoleType.SELLER)
export class PaymentCardsController {
  constructor(private readonly paymentCardsService: PaymentCardsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new payment card' })
  @ApiOkResponse({
    description: 'Card added successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PaymentCardDto),
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    type: ApiResponseDto,
  })
  async create(@Body() createCardDto: CreateCardDto) {
    const card = await this.paymentCardsService.create(createCardDto);
    return ApiResponseDto.success(card, 'Card added successfully');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all payment cards for the current user' })
  @ApiOkResponse({
    description: 'Cards retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(PaymentCardDto) },
            },
          },
        },
      ],
    },
  })
  async findAllByUserId() {
    const cards = await this.paymentCardsService.findAllByUserId();
    return ApiResponseDto.success(cards, 'Cards retrieved successfully');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific payment card by ID' })
  @ApiOkResponse({
    description: 'Card retrieved successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PaymentCardWithUserDto),
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    type: ApiResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const card = await this.paymentCardsService.findOne(id);
    return ApiResponseDto.success(card, 'Card retrieved successfully');
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a payment card' })
  @ApiOkResponse({
    description: 'Card updated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PaymentCardDto),
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    type: ApiResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    const card = await this.paymentCardsService.update(id, updateCardDto);
    return ApiResponseDto.success(card, 'Card updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment card' })
  @ApiResponse({
    status: 204,
    description: 'Card deleted successfully',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete default card',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    type: ApiResponseDto,
  })
  async remove(@Param('id') id: string) {
    await this.paymentCardsService.remove(id);
    return ApiResponseDto.success(null, 'Card deleted successfully');
  }

  @Post(':id/set-default')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set a payment card as default' })
  @ApiOkResponse({
    description: 'Card set as default successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PaymentCardDto),
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Card not found',
    type: ApiResponseDto,
  })
  async setDefault(@Param('id') id: string) {
    const card = await this.paymentCardsService.setDefaultCard(id);
    return ApiResponseDto.success(card, 'Card set as default successfully');
  }
}
