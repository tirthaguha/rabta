import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  SessionClaims,
  ValidateSessionOptions,
  ValidatedSession,
} from './types';

export function validateUserSession(
  token: string,
  options: ValidateSessionOptions
): ValidatedSession {
  // 1. Validate JWT signature + expiry
  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, options.secret) as JwtPayload;
  } catch (error) {
    console.log('error', error);
    throw new Error('INVALID_TOKEN');
  }

  const claims = payload as SessionClaims;

  // 2. Validate issuer
  if (claims.iss !== options.issuer) {
    throw new Error('INVALID_ISSUER');
  }

  // 3. Expiry is already validated by jwt.verify
  console.log('claims.exp', claims.exp);
  if (!claims.exp) {
    throw new Error('MISSING_EXPIRY');
  }

  // 4. Validate audience (if present)
  if (options.audience && claims.aud) {
    const isAudienceValid = claims.aud.some((aud) =>
      options.audience!.includes(aud)
    );

    if (!isAudienceValid) {
      throw new Error('INVALID_AUDIENCE');
    }
  }

  return {
    issuer: claims.iss,
    userId: claims.sub,
    audience: claims.aud,
    data: claims.data,
    expiresAt: claims.exp * 1000,
  };
}
