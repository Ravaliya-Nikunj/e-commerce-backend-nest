export class ApiResponseDto<T = any> {
  message: string;
  timestamp: Date;
  data?: T;
  success: boolean;
  meta?: any;
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
      meta,
    });
  }

  static error(message: string, meta?: any): ApiResponseDto {
    return new ApiResponseDto({
      message,
      success: false,
      meta,
    });
  }
}
