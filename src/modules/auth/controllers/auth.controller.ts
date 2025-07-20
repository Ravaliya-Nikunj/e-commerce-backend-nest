import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Res,
  Headers,
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
import { Response } from 'express';
import { EmailVerifyDto } from '../dtos/email-verify-dto';
import { EmailDto } from '../dtos/email.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
@UseGuards(AuthGuard, RolesGuard)
@ApiExtraModels(ApiResponseDto, TokenResponseDto, User)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ******************************** START User Login / Register  ***********************************

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
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const { email, verificationId } =
      await this.authService.doSignUp(emailSignUpDto);
    res.setHeader('x-internal-id', verificationId);
    return ApiResponseDto.success(
      { email },
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const { tokens, user, verificationId, isVerified } =
      await this.authService.signIn(signInDto);
    let message = 'Successfully signed in';
    if (verificationId) {
      res.setHeader('x-internal-id', verificationId);
      message =
        'OTP sent successfully! Check your inbox for the verification code.';
    }
    return ApiResponseDto.success({ tokens, user, isVerified }, message);
  }
  // ******************************** END User Login / Register  ***********************************

  @Public()
  @Post('/vendor/sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Vendor sign up' })
  @ApiOkResponse({
    description: 'Vendor successfully signed up',
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
  async vendorSignUp(
    @Body() emailSignUpDto: EmailSignUpDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const { email, verificationId } = await this.authService.doSignUp(
      emailSignUpDto,
      RoleType.SELLER,
    );
    res.setHeader('x-internal-id', verificationId);
    return ApiResponseDto.success(
      { email },
      'OTP sent successfully! Check your inbox for the verification code.',
    );
  }

  @Public()
  @Post('/vendor/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vendor sign in' })
  @ApiOkResponse({
    description: 'Vendor successfully signed in',
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
  async vendorSignIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const result = await this.authService.signIn(signInDto, RoleType.SELLER);
    let message = 'Successfully signed in';
    if (result.verificationId) {
      res.setHeader('x-internal-id', result.verificationId);
      message =
        'OTP sent successfully! Check your inbox for the verification code.';
    }
    return ApiResponseDto.success(result, message);
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
    const userDto = await this.authService.getUserDetails();

    return ApiResponseDto.success(
      userDto,
      'User information retrieved successfully',
    );
  }

  @Public()
  @Post('/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vendor sign in' })
  @ApiOkResponse({
    description: 'Vendor successfully signed in',
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
  async verify(
    @Body() verifyDto: EmailVerifyDto,
    @Headers('x-internal-id') verificationId: string,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const result = await this.authService.verifyOtp(verifyDto, verificationId);
    return ApiResponseDto.success(result, 'Successfully signed in');
  }

  @Public()
  @Post('/send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP' })
  @ApiOkResponse({
    description: 'OTP sent successfully',
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
  async sendOtp(
    @Body() emailDto: EmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<void>> {
    const { verificationId, message } =
      await this.authService.sendOtp(emailDto);

    if (verificationId) {
      res.setHeader('x-internal-id', verificationId);
    }
    return ApiResponseDto.success(null, message);
  }

  @Post('/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiOkResponse({
    description: 'Successfully changed password',
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
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ApiResponseDto<UserDto>> {
    const userDto = await this.authService.changePassword(changePasswordDto);
    return ApiResponseDto.success(userDto, 'Password changed successfully');
  }

  @Public()
  @Post('/request-reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request reset password' })
  @ApiOkResponse({
    description: 'Successfully requested reset password',
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
  async requestResetPassword(
    @Body() resetPasswordDto: EmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<void>> {
    const { verificationId, message } =
      await this.authService.requestResetPassword(resetPasswordDto);

    if (verificationId) {
      res.setHeader('x-internal-id', verificationId);
    }
    return ApiResponseDto.success(null, message);
  }

  @Public()
  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({
    description: 'Successfully reset password',
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
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Headers('x-internal-id') verificationId: string,
  ): Promise<ApiResponseDto<void>> {
    const { message } = await this.authService.resetPassword(
      resetPasswordDto,
      verificationId,
    );
    return ApiResponseDto.success(null, message);
  }
}
