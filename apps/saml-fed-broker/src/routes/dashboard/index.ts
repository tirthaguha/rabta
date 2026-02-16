import { sessionMiddleware } from '@rabta/session-manager';
import { Router } from 'express';

const route = Router();

route.get(
  '/',
  sessionMiddleware({
    secret: 'rZ2W5tN0R3rZ2l7E6yKZJYv9p3Y5v8x1o9HcXzYfG6k=',
    issuer: 'saml-fed-broker',
    tokenSource: { type: 'cookie', name: 'session_token' },
  }),
  async (req, res) => {
    res.send(`<!DOCTYPE html>
    <html>
      <head>
        <title>Dashboard</title>
      </head>
      <body>
        <h1>Login Success</h1>
        <p>You have successfully logged in using SAML.</p>
        <a href="/logout">Logout</a>
      </body>
    </html>`);
  }
);

export default route;
