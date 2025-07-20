import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'yourSecurePassword123!',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(100, {
    message: 'Password cannot be longer than 100 characters',
  })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword: string;

  @ApiProperty({ example: 'yourSecurePassword123!' })
  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Please confirm your new password' })
  @ValidateIf((o: ResetPasswordDto) => o.newPassword === o.confPassword)
  confPassword: string;
}
