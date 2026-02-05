import { Request } from 'express';
import { TokenSource } from './types';

export function extractToken(
  req: Request,
  sources: TokenSource[]
): string | null {
  for (const source of sources) {
    if (source.type === 'authorization-header') {
      const auth = req.headers.authorization;
      if (auth?.startsWith('Bearer ')) {
        return auth.slice(7);
      }
    }

    if (source.type === 'cookie') {
      const cookies = (req as any).cookies;
      if (cookies && cookies[source.name]) {
        return cookies[source.name];
      }
    }
  }

  return null;
}
