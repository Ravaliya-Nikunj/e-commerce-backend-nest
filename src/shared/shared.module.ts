import { Module } from '@nestjs/common';
import { CryptoUtil } from 'src/shared/utils/crypto.util';
import { BcryptUtil } from './utils/bcrypt.util';
import { OtpUtil } from './utils/otp.util';
import { DateUtil } from './utils/date.util';

@Module({
  providers: [CryptoUtil, BcryptUtil, OtpUtil, DateUtil],
  exports: [CryptoUtil, BcryptUtil, OtpUtil, DateUtil],
})
export class SharedModule {}
