import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export const correlationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correlationId =
    req.headers['x-correlation-id']?.toString() || randomUUID();

  req.headers['x-correlation-id'] = correlationId;

  res.setHeader('x-correlation-id', correlationId);

  next();
};
