import { Request } from 'express';

export interface SessionClaims {
  iss: string; // issuer
  sub: string; // email or unique user id
  exp?: number; // epoch seconds
  aud?: string[]; // optional audience
  data?: Record<string, unknown>; // roles, permissions, etc
}

export interface CreateSessionOptions {
  secret: string;
  issuer: string;
  expiresIn: number; // e.g. 3600
  audience?: string[];
}

export type TokenSource =
  | { type: 'authorization-header' }
  | { type: 'cookie'; name: string };

export interface ValidateSessionOptions {
  secret: string;
  issuer: string;
  audience?: string[];
  tokenSource?: TokenSource | TokenSource[];
}

export interface ValidatedSession {
  issuer: string;
  userId: string;
  audience?: string[];
  data?: Record<string, unknown>;
  expiresAt: number;
}

export interface RequestWithSession extends Request {
  session?: {
    nameID?: string;
    sessionIndex?: string;
    [key: string]: any; // Allow additional properties
  };
}
