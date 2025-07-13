import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { UserRepository } from '../../user/repositories/user.repository';
import { RoleType } from '../../../common/enums';
import { BcryptUtil } from '../../../shared/utils/bcrypt.util';
import { SignInDto } from '../../../common/dtos/sign-in.dto';
import { TokenResponseDto } from '../../../common/dtos/token-response.dto';
import { RoleRepository } from '../../role/repositories/role.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly jwtUtil: JwtUtil,
    private readonly bcryptUtil: BcryptUtil,
  ) {}

  async signIn(signInDto: SignInDto): Promise<TokenResponseDto> {
    const { email, password } = signInDto;
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const roleDetails = await this.roleRepository.getRoleByUserId(user.id);
    // Check if user exists and has admin role
    if (roleDetails.name !== RoleType.ADMIN) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Verify password
    const isPasswordValid = await this.bcryptUtil.bcryptCompare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const prepareJwtData = {
      sub: user.id,
      email: user.email,
      role: roleDetails.name,
      roleId: roleDetails.id,
    };
    // Generate tokens
    const tokens = this.jwtUtil.generateToken(prepareJwtData);

    return {
      tokens: {
        ...tokens,
      },
    };
  }
}
