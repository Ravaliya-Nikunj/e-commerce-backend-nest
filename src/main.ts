import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/base/app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionInterceptor } from './common/interceptors/http-exception-interceptor';
import { LoggingService } from './common/logging/logging.service';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  const logger = app.get(LoggingService);
  app.useLogger(logger);
  // Retrieve configuration values via ConfigService (loaded globally in AppModule)
  const configService = app.get(ConfigService);
  const APP_PORT = configService.get<number>('APP_PORT', 3000);
  const API_PREFIX = configService.get<string>('API_PREFIX', '');
  const API_DEFAULT_VERSION = configService.get<string>(
    'API_DEFAULT_VERSION',
    '1',
  );

  // Apply global prefix so that all routes are served under `/api` (or whatever API_PREFIX is set to)
  if (API_PREFIX) {
    app.setGlobalPrefix(API_PREFIX);
  }
  // Enable URI-based versioning: /v1
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_DEFAULT_VERSION,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          const field = error.property;
          const messages = Object.values(error.constraints || {});

          if (messages.length > 0) {
            acc[field] = messages;
          }

          return acc;
        }, {});

        const errorResponse = {
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        };

        return new BadRequestException(errorResponse);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionInterceptor(logger));

  await app.listen(APP_PORT);
  logger.log(
    `Application is running on http://localhost:${APP_PORT}/${API_PREFIX}/v${API_DEFAULT_VERSION}`,
  );
};
bootstrap();
