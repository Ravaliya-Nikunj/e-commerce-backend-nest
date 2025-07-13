import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 'USR-1234567890',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  @Expose()
  userName: string;

  @ApiPropertyOptional({
    description: 'URL to the profile image of the user',
    example: 'https://example.com/profiles/johndoe.jpg',
  })
  @Expose()
  profileImage: string;
}
