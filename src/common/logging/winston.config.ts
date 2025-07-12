import { format, transports, createLogger } from 'winston';
import * as moment from 'moment';

const appName = 'E-Commerce';

// Custom format that handles both string and object messages
const customFormat = format.printf(
  ({ level, message, timestamp, ...meta }: any) => {
    let logMessage = `[${appName}] [${moment(timestamp).format('DD-MM-YYYY HH:mm:ss A')}] [${level}] ${message}`;

    // Add metadata if it exists
    const metaWithoutLevel = { ...meta };
    delete metaWithoutLevel.level;

    if (Object.keys(metaWithoutLevel.metadata).length > 0) {
      logMessage += `\n${JSON.stringify(metaWithoutLevel.metadata, null, 2)}`;
    }

    return logMessage;
  },
);

export const winstonConfig = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), customFormat),
    }),
  ],
});
