import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { EmailSignUpDto } from '../dtos/email-sign-up.dto';

@Controller({
  path: 'auth/user',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() emailSignUpDto: EmailSignUpDto) {
    return this.authService.doSignUp(emailSignUpDto);
  }
}
