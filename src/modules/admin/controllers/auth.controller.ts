import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../../../common/dtos/sign-in.dto';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { TokenResponseDto } from 'src/common/dtos/token-response.dto';

@ApiTags('Admin Authentication')
@Controller({ path: 'auth/admin', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin sign in' })
  @ApiResponse({
    status: 200,
    description: 'Admin successfully signed in',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ApiResponseDto,
  })
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const tokens = await this.authService.signIn(signInDto);
    return ApiResponseDto.success(tokens, 'Signed in successfully');
  }
}
