import { NextFunction, Request, Response } from 'express';
import { extractToken } from './extract-token';
import { ValidateSessionOptions } from './types';
import { validateUserSession } from './validate-session';

export interface AuthenticatedRequest extends Request {
  session?: ReturnType<typeof validateUserSession>;
}

export function sessionMiddleware(options: ValidateSessionOptions) {
  const tokenSources = options.tokenSource ?? [
    { type: 'authorization-header' },
  ];

  const sources = Array.isArray(tokenSources) ? tokenSources : [tokenSources];

  // console.log(sources);

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = extractToken(req, sources);
    // console.log('Extracted token:', token);

    if (!token) {
      console.log('Error Here');
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    try {
      const session = validateUserSession(token, options);
      req.session = session;
      next();
      return;
    } catch (error) {
      console.log('Or Here', error);
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }
  };
}
