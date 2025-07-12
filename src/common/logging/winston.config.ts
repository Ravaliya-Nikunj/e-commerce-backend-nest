import { format, transports, createLogger } from 'winston';
import * as moment from 'moment';
const appName = 'E-Commerce';
export const winstonConfig = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info: { timestamp: string; level: string; message: string }) => {
            return `[${appName}] [${moment(info.timestamp).format(
              'DD-MM-YYYY HH:mm:ss A',
            )}] [${info.level}] ${info.message}`;
          },
        ),
      ),
    }),
  ],
});
