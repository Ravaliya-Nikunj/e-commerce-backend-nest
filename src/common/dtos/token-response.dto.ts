import { User } from '../../modules/user/entities/user.entity';

export class TokenResponseDto {
  user?: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
