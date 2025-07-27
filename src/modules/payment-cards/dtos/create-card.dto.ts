import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ description: 'Card number', example: '4111111111111111' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  cardNumber: string;

  @ApiProperty({ description: 'Name on the card', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  cardHolderName: string;

  @ApiProperty({
    description: 'Card expiry date in MM/YY format',
    example: '12/25',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  cardExpiryDate: string;

  @ApiProperty({ description: 'Type of card', example: 'Visa' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  cardType: string;

  @ApiProperty({
    description: 'Set as default card',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
