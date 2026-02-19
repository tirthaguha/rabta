import { NextFunction, Request, Response } from 'express';
import { logger } from '../index';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.info('http_request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      location: res.get('Location') || undefined,
      durationMs: Date.now() - start,
      correlationId: req.headers['x-correlation-id'],
      ip: req.ip,
    });
  });

  next();
};
