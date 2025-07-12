import { Module } from '@nestjs/common';
import { CryptoUtil } from 'src/shared/utils/crypto.util';
import { BcryptUtil } from './utils/bcrypt.util';
import { OtpUtil } from './utils/otp.util';
import { DateUtil } from './utils/date.util';
import { CommonUtil } from './utils/common.util';

@Module({
  providers: [CryptoUtil, BcryptUtil, OtpUtil, DateUtil, CommonUtil],
  exports: [CryptoUtil, BcryptUtil, OtpUtil, DateUtil, CommonUtil],
})
export class SharedModule {}
