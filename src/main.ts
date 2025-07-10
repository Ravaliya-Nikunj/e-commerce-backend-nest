import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/base/app.module';
import * as donenv from 'dotenv';

// This is very import in purspective of loading dynamic env files.
const NODE_ENV = process.env.NODE_ENV || 'development';
donenv.config({ path: `.env.${NODE_ENV}` });
const { APP_PORT, API_PREFIX } = process.env;
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  // Apply global prefix so that all routes are served under `/api` (or whatever API_PREFIX is set to)
  if (API_PREFIX) {
    app.setGlobalPrefix(API_PREFIX);
  }
  
  await app.listen(APP_PORT ?? 3000);

  console.log(
    `Application is running on http://localhost:${APP_PORT}/${API_PREFIX}`,
  );
};
bootstrap();
