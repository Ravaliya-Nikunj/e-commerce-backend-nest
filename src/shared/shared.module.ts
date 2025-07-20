import { Global, Module } from '@nestjs/common';
import { CryptoUtil } from './utils/crypto.util';
import { BcryptUtil } from './utils/bcrypt.util';
import { OtpUtil } from './utils/otp.util';
import { DateUtil } from './utils/date.util';
import { CommonUtil } from './utils/common.util';
import { JwtUtil } from './utils/jwt.util';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ContextService } from './services/context.service';
import { CloudinaryUtil } from './utils/cloudinary.utils';
@Global()
@Module({
  imports: [JwtModule.register({}), ConfigModule],
  providers: [
    CryptoUtil,
    BcryptUtil,
    OtpUtil,
    DateUtil,
    CommonUtil,
    JwtUtil,
    ContextService,
    CloudinaryUtil,
  ],
  exports: [
    CryptoUtil,
    BcryptUtil,
    OtpUtil,
    DateUtil,
    CommonUtil,
    JwtUtil,
    ContextService,
    CloudinaryUtil,
  ],
})
export class SharedModule {}
