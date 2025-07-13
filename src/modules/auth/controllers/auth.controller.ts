import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { EmailSignUpDto } from '../dtos/email-sign-up.dto';
import { SignInDto } from '../../../common/dtos/sign-in.dto';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';
import { TokenResponseDto } from 'src/common/dtos/token-response.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/user/sign-up')
  async signUp(@Body() emailSignUpDto: EmailSignUpDto) {
    const result = await this.authService.doSignUp(emailSignUpDto);
    return ApiResponseDto.success(
      result,
      'OTP sent successfully! Check your inbox for the verification code.',
    );
  }

  @Post('/user/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<ApiResponseDto<TokenResponseDto>> {
    const result = await this.authService.signIn(signInDto);
    return ApiResponseDto.success(result, 'Successfully signed in');
  }
}
