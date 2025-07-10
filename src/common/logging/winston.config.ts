import { format, transports, createLogger } from 'winston';
import * as moment from 'moment';

export const winstonConfig = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info: { timestamp: string; level: string; message: string }) => {
            return `[${moment(info.timestamp).format(
              'DD-MM-YYYY HH:mm:ss A',
            )}] [${info.level}] ${info.message}`;
          },
        ),
      ),
    }),
  ],
});
