import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../modules/user/entities/user.entity';

export class TokenResponseDto {
  @ApiPropertyOptional({
    description: 'User information',
    type: User,
    example: {
      id: 'USR-1234567890',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      userName: 'johndoe',
      profileImage: 'https://example.com/profiles/johndoe.jpg'
    }
  })
  user?: User;

  @ApiProperty({
    description: 'Authentication tokens',
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        description: 'JWT access token for authentication',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      refreshToken: {
        type: 'string',
        description: 'JWT refresh token for getting new access tokens',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  })
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
