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
import { CommonUtil } from '../../../shared/utils/common.util';
import { UserRoleService } from '../../user-roles/services/user-role.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { UserDto } from 'src/modules/user/dtos/user.dto';
import { plainToClass } from 'class-transformer';
import { RoleType } from 'src/common/enums/role.enum';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly sequelize: Sequelize,
    private readonly loggerService: LoggingService,
    private readonly cryptoUtil: CryptoUtil,
    private readonly bcryptUtil: BcryptUtil,
    private readonly otpUtil: OtpUtil,
    private readonly dateUtil: DateUtil,
    private readonly commonUtil: CommonUtil,
    private readonly jwtUtil: JwtUtil,
  ) {}

  doSignUp = async (requestBody: EmailSignUpDto) => {
    const transaction = await this.sequelize.transaction();
    this.loggerService.log('Transaction started');
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        isTermsAgree,
      } = requestBody;
      if (!isTermsAgree) {
        throw new BadRequestException(
          'You must agree to the terms and conditions',
        );
      }
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
      const prepareSaveUser: any = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        otp,
        otpDate,
        userName: this.commonUtil.generateUsername(firstName, lastName, email),
      };
      const savedUser = await this.userService.create(
        prepareSaveUser,
        transaction,
      );
      const prepareSaveUserRole: any = {
        userId: savedUser.id,
        roleId: role.id,
      };
      await this.userRoleService.create(prepareSaveUserRole, transaction);

      await transaction.commit();

      return { email: savedUser.email };
    } catch (error) {
      this.loggerService.error('Transaction failed', error);
      await transaction.rollback();
      throw error;
    }
  };

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Find user by email
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    // Check if user is active
    if (user.isDeleted) {
      throw new BadRequestException('Your account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await this.bcryptUtil.bcryptCompare(
      this.cryptoUtil.getDecryptionString(password),
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const roleDetails = await this.roleService.getRoleByUserId(user.id);
    if (roleDetails.name !== RoleType.USER) {
      throw new BadRequestException('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isVerified) {
      this.loggerService.log(
        'Email is not verified send new otp to user and return a response',
      );
    }
    const prepareJwtData = {
      sub: user.id,
      email: user.email,
      role: roleDetails.name,
      roleId: roleDetails.id,
    };
    const tokens = this.jwtUtil.generateToken(prepareJwtData);
    const userDto = plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
    return {
      user: userDto,
      tokens,
    };
  }
}
