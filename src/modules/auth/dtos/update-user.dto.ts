import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: true,
  })
  @IsOptional()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      'First name can only contain letters, spaces, hyphens, and apostrophes',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: true,
  })
  @IsOptional()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot be longer than 50 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      'Last name can only contain letters, spaces, hyphens, and apostrophes',
  })
  lastName: string;
  @IsOptional()
  @IsString()
  phoneCode?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{7,15}$/, {
    message: 'Phone number must be between 7 and 15 digits',
  })
  phoneNumber?: string;

  @IsOptional()
  profileImage?: string; // handled separately via Multer
}
