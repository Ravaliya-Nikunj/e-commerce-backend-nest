import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EmailSignUpDto } from '../dtos/email-sign-up.dto';
import { UserService } from '../../user/services/user.service';
import { Sequelize } from 'sequelize-typescript';
import { LoggingService } from '../../../logging/logging.service';
import { CryptoUtil } from '../../../shared/utils/crypto.util';
import { BcryptUtil } from '../../../shared/utils/bcrypt.util';
import { OtpUtil } from '../../../shared/utils/otp.util';
import { DateUtil } from '../../../shared/utils/date.util';
import { RoleService } from '../../role/services/role.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly sequelize: Sequelize,
    private readonly loggerService: LoggingService,
    private readonly cryptoUtil: CryptoUtil,
    private readonly bcryptUtil: BcryptUtil,
    private readonly otpUtil: OtpUtil,
    private readonly dateUtil: DateUtil,
  ) {}

  doSignUp = async (requestBody: EmailSignUpDto) => {
    const transaction = await this.sequelize.transaction();
    this.loggerService.log('Transaction started');
    try {
      const { firstName, lastName, email, password, confirmPassword } =
        requestBody;
      const decodedPassword = this.cryptoUtil.getDecryptionString(password);
      const decodedConfirmPassword =
        this.cryptoUtil.getDecryptionString(confirmPassword);

      if (decodedPassword !== decodedConfirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      const isUserExists = await this.userService.findByEmail(email);
      if (isUserExists) {
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = this.bcryptUtil.bcryptPassword(decodedPassword);
      const otp = this.otpUtil.generateOtp();
      const otpDate = this.dateUtil.getEpochFromDate(new Date());
      const role = await this.roleService.findByName('User');
      const prepareSaveUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        otp,
        otpDate,
      };
      // await this.userService.create(prepareSaveUser);
      await transaction.commit();
      return prepareSaveUser;
    } catch (error) {
      this.loggerService.error('Transaction failed', error);
      await transaction.rollback();
      throw new InternalServerErrorException(
        error.message || 'Internal server error',
      );
    }
  };
}
