import { createLogger, format, transports } from 'winston';

const isProd = process.env.NODE_ENV === 'production';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'silly',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: isProd
        ? format.json()
        : format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({ filename: 'logs/all.log', level: 'info' }),
  ],
});
