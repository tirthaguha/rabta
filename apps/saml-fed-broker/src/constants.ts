import { ValidateSessionOptions } from '@rabta/session-manager';
import fs from 'fs';
import path from 'path';

export const CERTNAME = 'sp.crt';
export const KEYNAME = 'sp.key';
export const CERT_DIR = 'certs';
export const JWT_SECRET = 'rZ2W5tN0R3rZ2l7E6yKZJYv9p3Y5v8x1o9HcXzYfG6k=';
export const JWT_ISSUER = 'saml-fed-broker';
export const TOKEN_TYPE = 'cookie';
export const TOKEN_NAME = 'session_token';

export const SESSION_DURATION = 1800;

export const sessionValidationConfig: ValidateSessionOptions = {
  secret: JWT_SECRET,
  issuer: JWT_ISSUER,
  tokenSource: { type: TOKEN_TYPE, name: TOKEN_NAME },
};

const certDir = path.join(process.cwd(), CERT_DIR);
const privateKey = fs.readFileSync(path.join(certDir, KEYNAME), 'utf-8');
const certificate = fs.readFileSync(path.join(certDir, CERTNAME), 'utf-8');
export { certificate, privateKey };
