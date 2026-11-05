import winston from 'winston';

// Console only: hosting platforms collect stdout. Never log application contents (HKID, bank details).
const logger = winston.createLogger({
  level: 'info',
  format:
    process.env.NODE_ENV === 'production'
      ? winston.format.combine(winston.format.timestamp(), winston.format.json())
      : winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

export { logger };
