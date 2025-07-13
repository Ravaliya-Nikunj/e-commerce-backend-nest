import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../../../common/dtos/sign-in.dto';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { TokenResponseDto } from '../../../common/dtos/token-response.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiTags('Admin Authentication')
@ApiExtraModels(ApiResponseDto, TokenResponseDto)
@Controller({ path: 'auth/admin', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin sign in' })
  @ApiOkResponse({
    description: 'Admin successfully signed in',
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
    const tokens = await this.authService.signIn(signInDto);
    return ApiResponseDto.success(tokens, 'Signed in successfully');
  }
}
