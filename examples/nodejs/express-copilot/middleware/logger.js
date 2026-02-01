/**
 * Winston-based structured logging middleware
 */

import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

export const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'express-copilot' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp, ...meta }) =>
            `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`
        )
      )
    })
  ]
});

/**
 * Express middleware for request logging
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function logger(req, res, next) {
  const start = Date.now();

  // Log request
  winstonLogger.info('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`
    };

    if (res.statusCode >= 500) {
      winstonLogger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      winstonLogger.warn('Client error', logData);
    } else {
      winstonLogger.info('Request completed', logData);
    }
  });

  next();
}
