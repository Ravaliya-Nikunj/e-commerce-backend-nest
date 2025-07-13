import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { EmailSignUpDto } from '../dtos/email-sign-up.dto';
import { SignInDto } from '../../../common/dtos/sign-in.dto';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { TokenResponseDto } from '../../../common/dtos/token-response.dto';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/user/sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: EmailSignUpDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'User registered successfully. OTP sent to email.',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Validation error or user already exists' 
  })
  async signUp(@Body() emailSignUpDto: EmailSignUpDto) {
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
  @ApiBody({ type: SignInDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Successfully signed in',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Invalid credentials' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Validation error' 
  })
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const result = await this.authService.signIn(signInDto);
    return ApiResponseDto.success(result, 'Successfully signed in');
  }
}
