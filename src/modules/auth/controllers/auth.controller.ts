import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  getSchemaPath,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { EmailSignUpDto } from '../dtos/email-sign-up.dto';
import { SignInDto } from '../../../common/dtos/sign-in.dto';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { TokenResponseDto } from '../../../common/dtos/token-response.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { ApiExtraModels } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { UserDto } from '../../user/dtos/user.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
@UseGuards(AuthGuard, RolesGuard)
@ApiExtraModels(ApiResponseDto, TokenResponseDto, User)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/user/sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User sign up' })
  @ApiOkResponse({
    description: 'User successfully signed up',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TokenResponseDto) },
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
  async signUp(
    @Body() emailSignUpDto: EmailSignUpDto,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const result = await this.authService.doSignUp(emailSignUpDto);
    return ApiResponseDto.success(
      result,
      'OTP sent successfully! Check your inbox for the verification code.',
    );
  }

  @Public()
  @Post('/user/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User sign in' })
  @ApiOkResponse({
    description: 'User successfully signed in',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(TokenResponseDto) },
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
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const result = await this.authService.signIn(signInDto);
    return ApiResponseDto.success(result, 'Successfully signed in');
  }

  @Get('/user/me')
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
    const userDto = await this.authService.getUserDetails();

    return ApiResponseDto.success(
      userDto,
      'User information retrieved successfully',
    );
  }
}
