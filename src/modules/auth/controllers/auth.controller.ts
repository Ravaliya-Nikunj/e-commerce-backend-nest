import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { EmailSignUpDto } from '../dtos/email-sign-up.dto';
import { ApiResponseDto } from '../../../common/dtos/api-response.dto';

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
}
