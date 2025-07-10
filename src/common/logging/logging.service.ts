import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import { winstonConfig } from './winston.config';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger: Logger = winstonConfig;

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, ...optionalParams);
  }
}
