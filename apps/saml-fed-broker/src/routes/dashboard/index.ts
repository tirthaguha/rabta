import { RequestWithSession, sessionMiddleware } from '@rabta/session-manager';
import { Response, Router } from 'express';
import { sessionValidationConfig } from '../../constants';

const route = Router();

route.get(
  '/',
  sessionMiddleware(sessionValidationConfig),
  async (req: RequestWithSession, res: Response) => {
    res.send(`<!DOCTYPE html>
    <html>
      <head>
        <title>Dashboard</title>
      </head>
      <body>
        <h1>Login Success</h1>
        <p>You have successfully logged in using SAML as <code>${req.session?.userId || 'Unknown User'}</code>.</p>
        <a href="/logout">Logout</a>
      </body>
    </html>`);
  }
);

export default route;
