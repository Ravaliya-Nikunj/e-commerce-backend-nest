import {
  Injectable,
  BadRequestException,
  ForbiddenException,
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
import { SignInDto } from '../../../common/dtos/sign-in.dto';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { UserDto } from '../../user/dtos/user.dto';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../../../common/enums';
import { ContextService } from '../../../shared/services/context.service';
import { TokenResponseDto } from '../../../common/dtos/token-response.dto';
import { EmailVerifyDto } from '../dtos/email-verify-dto';
import { EmailDto } from '../dtos/email.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
@Injectable()
export class AuthService {
  private verficationIdDelimeter = '::::';
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly sequelize: Sequelize,
    private readonly loggerService: LoggingService,
    private readonly contextService: ContextService,
    private readonly cryptoUtil: CryptoUtil,
    private readonly bcryptUtil: BcryptUtil,
    private readonly otpUtil: OtpUtil,
    private readonly dateUtil: DateUtil,
    private readonly commonUtil: CommonUtil,
    private readonly jwtUtil: JwtUtil,
  ) {}

  doSignUp = async (
    requestBody: EmailSignUpDto,
    roleType: RoleType = RoleType.USER,
  ) => {
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
      const role = await this.roleService.findByName(roleType);
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

      // TODO :: send email along with otp.

      const verificationId = this.commonUtil.getVerificationId(
        savedUser.id,
        roleType,
        savedUser.email,
      );

      await transaction.commit();

      return { email: savedUser.email, verificationId };
    } catch (error) {
      this.loggerService.error('Transaction failed', error);
      await transaction.rollback();
      throw error;
    }
  };

  async signIn(
    signInDto: SignInDto,
    roleType: RoleType = RoleType.USER,
  ): Promise<TokenResponseDto> {
    const { email, password } = signInDto;
    const result: TokenResponseDto = {
      user: undefined,
      tokens: undefined,
      isVerified: true,
    };
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
    if (roleDetails.name !== roleType) {
      throw new BadRequestException('Invalid email or password');
    }
    let verificationId = '';

    // Check if email is verified
    if (!user.isVerified) {
      this.loggerService.log(
        'Email is not verified send new otp to user and return a response',
      );

      verificationId = this.commonUtil.getVerificationId(
        user.id,
        roleType,
        user.email,
      );
      const otp = this.otpUtil.generateOtp();
      const otpDate = this.dateUtil.getEpochFromDate(new Date());
      const prepareUpdateUser: any = {
        otp,
        otpDate,
      };
      await this.userService.update(prepareUpdateUser, user.id);
      result.verificationId = verificationId;
      result.isVerified = false;
      return result;
    }

    const prepareJwtData = {
      sub: user.id,
      email: user.email,
      role: roleDetails.name,
      roleId: roleDetails.id,
    };
    const tokens = this.jwtUtil.generateToken(prepareJwtData);
    const userDto: any = plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
    result.user = userDto;
    result.tokens = tokens;
    return result;
  }

  async verifyOtp(
    verifyDto: EmailVerifyDto,
    verificationId: string,
  ): Promise<TokenResponseDto> {
    const { email, otp } = verifyDto;
    const decodedVerificationId =
      this.cryptoUtil.getDecryptionString(verificationId);
    const [userId, roleType, userMail] = decodedVerificationId.split(
      this.verficationIdDelimeter,
    );
    if (email !== userMail) {
      throw new ForbiddenException('Forbidden!');
    }
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`user not found with email :${email}`);
    }
    const roleDetails = await this.roleService.getRoleByUserId(user.id);
    if (userId !== user.id || roleType !== roleDetails.name) {
      throw new ForbiddenException('Forbidden!');
    }
    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP. Please enter a valid OTP.');
    }
    const { min } = this.dateUtil.getDifferenceOfTwoDate(
      user.otpDate as unknown as string,
    );
    if (isNaN(min) || min >= 5) {
      throw new BadRequestException('OTP expired!');
    }
    const prepareUpdateUser: any = {
      otp: null,
      otpDate: null,
      isVerified: true,
    };
    await this.userService.update(prepareUpdateUser, user.id);
    const prepareJwtData = {
      sub: user.id,
      email: user.email,
      role: roleDetails.name,
      roleId: roleDetails.id,
    };
    const tokens = this.jwtUtil.generateToken(prepareJwtData);
    const userDto: any = plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
    const result: TokenResponseDto = {
      user: userDto,
      tokens,
    };
    return result;
  }

  async sendOtp(
    emailDto: EmailDto,
  ): Promise<{ verificationId: string; message: string }> {
    const { email } = emailDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`User not found with email: ${email}`);
    }

    const roleDetails = await this.roleService.getRoleByUserId(user.id);

    const otpDate = user.otpDate;
    let shouldGenerateOtp = false;

    if (!otpDate) {
      shouldGenerateOtp = true;
    } else {
      const { min } = this.dateUtil.getDifferenceOfTwoDate(
        otpDate as unknown as string,
      );
      if (isNaN(min) || min >= 5) {
        shouldGenerateOtp = true;
      }
    }

    let verificationId = '';

    if (shouldGenerateOtp) {
      const otp = this.otpUtil.generateOtp();
      const newOtpDate = this.dateUtil.getEpochFromDate(new Date());

      const prepareUpdateUser: any = {
        otp,
        otpDate: newOtpDate,
      };

      await this.userService.update(prepareUpdateUser, user.id);

      // TODO: send OTP in email
      verificationId = this.commonUtil.getVerificationId(
        user.id,
        roleDetails.name,
        user.email,
      );
    }
    return {
      verificationId,
      message: shouldGenerateOtp
        ? 'OTP sent successfully! Check your inbox for the verification code.'
        : 'OTP already sent! Please check your inbox.',
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword, confPassword } = changePasswordDto;

    const email = this.contextService.getEmail();
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(`User not found with email: ${email}`);
    }

    // Compare provided current password with hashed one in DB
    const isMatch = await this.bcryptUtil.bcryptCompare(
      currentPassword,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Invalid current password');
    }

    if (newPassword !== confPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Prevent password reuse
    const isSameAsOld = await this.bcryptUtil.bcryptCompare(
      newPassword,
      user.password,
    );
    if (isSameAsOld) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    // Hash new password and update
    const hashedNewPassword = this.bcryptUtil.bcryptPassword(newPassword);
    const prepareUpdateUser: any = {
      password: hashedNewPassword,
    };
    await this.userService.update(prepareUpdateUser, user.id);

    // Optionally: Log or track password change
    this.loggerService.log(`Password changed for user: ${email}`);
  }

  async requestResetPassword(
    emailDto: EmailDto,
  ): Promise<{ verificationId: string; message: string }> {
    return this.sendOtp(emailDto);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    verificationId: string,
  ): Promise<{ message: string }> {
    const { confPassword, newPassword } = resetPasswordDto;
    if (newPassword !== confPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const decodedVerificationId =
      this.cryptoUtil.getDecryptionString(verificationId);
    const [userId, roleType, userMail] = decodedVerificationId.split(
      this.verficationIdDelimeter,
    );
    const user = await this.userService.findByEmail(userMail);
    if (!user) {
      throw new BadRequestException(`User not found with email: ${userMail}`);
    }
    const roleDetails = await this.roleService.getRoleByUserId(user.id);
    if (userId !== user.id || roleType !== roleDetails.name) {
      throw new ForbiddenException('Forbidden!');
    }
    const isMatch = await this.bcryptUtil.bcryptCompare(
      newPassword,
      user.password,
    );
    if (isMatch) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }
    const hashedNewPassword = this.bcryptUtil.bcryptPassword(newPassword);
    const prepareUpdateUser: any = {
      otp: null,
      otpDate: null,
      password: hashedNewPassword,
    };
    await this.userService.update(prepareUpdateUser, user.id);
    this.loggerService.log(`Password reset for user: ${userMail}`);
    return {
      message: 'Password reset successfully',
    };
  }
}
