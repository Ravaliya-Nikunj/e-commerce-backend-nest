import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/base/app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionInterceptor } from './common/interceptors/http-exception-interceptor';
import { LoggingService } from './common/logging/logging.service';
import { ValidationPipe, VersioningType } from '@nestjs/common';

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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalFilters(new HttpExceptionInterceptor(logger));

  await app.listen(APP_PORT);
  logger.log(
    `Application is running on http://localhost:${APP_PORT}/${API_PREFIX}/v${API_DEFAULT_VERSION}`,
  );
};
bootstrap();
