import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2023-07-13T12:34:56.789Z',
  })
  timestamp: Date;

  @ApiPropertyOptional({
    description: 'Response data payload',
  })
  data?: any;

  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  constructor(partial?: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date();
    this.success = partial?.success ?? true;
  }

  static success(data: any, message: string, meta?: any): ApiResponseDto {
    return new ApiResponseDto({
      success: true,
      data,
      message,
    });
  }

  static error(message: string): ApiResponseDto {
    return new ApiResponseDto({
      message,
      success: false,
    });
  }
}
