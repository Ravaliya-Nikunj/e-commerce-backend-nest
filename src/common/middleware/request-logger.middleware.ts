// src/common/middleware/request-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, path, body } = req;

    this.loggingService.log(`[${method}] ${path} - Request started`, {
      method,
      url,
      path,
      body: body || {},
    });

    res.on('finish', () => {
      const status = res.statusCode;

      this.loggingService.log(`[${method}] ${path} - Request completed`, {
        method,
        url,
        path,
        status,
      });
    });

    next();
  }
}
