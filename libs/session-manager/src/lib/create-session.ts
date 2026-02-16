import jwt from 'jsonwebtoken';
import { CreateSessionOptions, SessionClaims } from './types';

export function createUserSession(
  userId: string,
  data: Record<string, unknown> | undefined,
  options: CreateSessionOptions
): string {
  const claims: SessionClaims = {
    iss: options.issuer,
    sub: userId,
    aud: options.audience,
    exp: Math.floor(Date.now() / 1000) + options.expiresIn,
    data,
  };

  return jwt.sign(claims, options.secret, {
    algorithm: 'HS256',
  });
}
