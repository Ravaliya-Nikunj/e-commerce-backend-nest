import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../user/dtos/user.dto';

export class PaymentCardDto {
  @ApiProperty({ description: 'ID of the card', example: '1234567890' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'User ID', example: '1234567890' })
  @Expose()
  userId: string;

  @ApiProperty({ description: 'Name of the card', example: 'Home' })
  @Expose()
  cardHolderName: string;

  @ApiProperty({ description: 'Card number', example: '4111111111111111' })
  @Expose()
  cardNumber: string;

  @ApiProperty({ description: 'Card expiry date', example: '12/25' })
  @Expose()
  cardExpiryDate: string;

  @ApiProperty({ description: 'Card type', example: 'Visa' })
  @Expose()
  cardType: string;

  @ApiProperty({
    description: 'Set as default card',
    example: false,
    required: false,
  })
  @Expose()
  isDefault?: boolean;
}

export class PaymentCardWithUserDto extends PaymentCardDto {
  @ApiProperty({ description: 'User details', type: UserDto })
  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
