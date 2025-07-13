import { Global, Module } from '@nestjs/common';
import { CryptoUtil } from './utils/crypto.util';
import { BcryptUtil } from './utils/bcrypt.util';
import { OtpUtil } from './utils/otp.util';
import { DateUtil } from './utils/date.util';
import { CommonUtil } from './utils/common.util';
import { JwtUtil } from './utils/jwt.util';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Global()
@Module({
  imports: [JwtModule.register({}), ConfigModule],
  providers: [CryptoUtil, BcryptUtil, OtpUtil, DateUtil, CommonUtil, JwtUtil],
  exports: [CryptoUtil, BcryptUtil, OtpUtil, DateUtil, CommonUtil, JwtUtil],
})
export class SharedModule {}
