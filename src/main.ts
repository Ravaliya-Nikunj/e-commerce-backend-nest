import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/base/app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionInterceptor } from './common/interceptors/http-exception-interceptor';
import { LoggingService } from './logging/logging.service';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  const logger = app.get(LoggingService);
  app.useLogger(logger);

  // Create and apply request logger middleware
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

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('E-Commerce API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(APP_PORT);
  logger.log(
    `Application is running on http://localhost:${APP_PORT}/${API_PREFIX}/v${API_DEFAULT_VERSION}`,
  );
  logger.log(
    `Swagger documentation available at: http://localhost:${APP_PORT}/api-docs`,
  );
};
bootstrap();
