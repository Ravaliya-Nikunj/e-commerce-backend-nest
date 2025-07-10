import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';

@Catch()
export class HttpExceptionInterceptor implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Base response structure
    const baseResponseBody = {
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    let extraPayload: Record<string, any> = {};

    if (exception instanceof HttpException) {
      // Handle NestJS HTTP exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // For validation errors, preserve entire response (messages, validation errors, etc.)
        extraPayload = exceptionResponse as Record<string, any>;
      } else {
        message = String(exceptionResponse);
        error = exception.name;
      }

      this.logger.error(`HTTP Exception: ${message}`, exception.stack);
    } else if (
      exception &&
      typeof exception === 'object' &&
      'code' in exception &&
      typeof exception.code === 'string' &&
      exception.code.startsWith('23')
    ) {
      // Handle database errors (like constraint violations with code starting with 23)
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'Database query failed';
      error = 'Database Error';

      const dbError = exception as unknown as {
        message?: string;
        stack?: string;
      };

      this.logger.error(
        `Database error: ${dbError.message || 'Unknown database error'}`,
        dbError.stack,
      );
    } else if (exception instanceof Error) {
      // Handle standard JS errors
      message = exception.message || 'Unknown error';
      error = exception.name || 'Error';

      this.logger.error(`Error: ${message}`, exception.stack);
    } else {
      // Handle any other type of exception
      this.logger.error('Unknown exception occurred', String(exception));
    }

    // Unified final response
    const finalBody = {
      ...baseResponseBody,
      statusCode: status,
      ...(Object.keys(extraPayload).length ? extraPayload : { message, error }),
    };

    response.status(status).send(finalBody);
  }
}
