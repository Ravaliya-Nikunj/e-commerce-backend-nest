import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../user/dtos/user.dto';

export class AddressDto {
  @ApiProperty({ description: 'Name of the address', example: 'Home' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'User ID', example: '1234567890' })
  @Expose()
  userId: string;

  @ApiProperty({ description: 'Country calling code', example: '+1' })
  @Expose()
  phoneCode: string;

  @ApiProperty({ description: 'Phone number', example: '9876543210' })
  @Expose()
  phoneNumber: string;

  @ApiProperty({ description: 'First line of address', example: '123 Main St' })
  @Expose()
  line1: string;

  @ApiProperty({
    description: 'Second line of address',
    example: 'Apt 4B',
    required: false,
  })
  @Expose()
  line2?: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @Expose()
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'NY' })
  @Expose()
  state: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  @Expose()
  country: string;

  @ApiProperty({ description: 'ZIP/Postal code', example: '10001' })
  @Expose()
  zipCode: string;

  @ApiProperty({
    description: 'Set as default address',
    example: false,
    required: false,
  })
  @Expose()
  isDefault?: boolean;
}

export class AddressWithUserDto extends AddressDto {
  @ApiProperty({ description: 'User details', type: UserDto })
  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
