import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'Name of the address', example: 'Home' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Country calling code', example: '+1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  phoneCode: string;

  @ApiProperty({ description: 'Phone number', example: '9876543210' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  phoneNumber: string;

  @ApiProperty({ description: 'First line of address', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  line1: string;

  @ApiProperty({ 
    description: 'Second line of address', 
    example: 'Apt 4B',
    required: false 
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  line2?: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'NY' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  state: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  country: string;

  @ApiProperty({ description: 'ZIP/Postal code', example: '10001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zipCode: string;

  @ApiProperty({ 
    description: 'Set as default address', 
    example: false,
    required: false 
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
