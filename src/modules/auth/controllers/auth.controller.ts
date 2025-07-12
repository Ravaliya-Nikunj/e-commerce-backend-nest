import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { EmailSignUpDto } from '../dtos/email-sign-up.dto';
import { LoggingService } from '../../../common/logging/logging.service';

@Controller({
  path: 'auth/user',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: LoggingService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() emailSignUpDto: EmailSignUpDto) {
    const result = await this.authService.doSignUp(emailSignUpDto);
    return result;
  }
}
