import { RequestWithSession, sessionMiddleware } from '@rabta/session-manager';
import { Request, Response, Router } from 'express';
import { sessionValidationConfig } from '../../constants';

const route = Router();

route.get(
  '/',
  sessionMiddleware(sessionValidationConfig),
  async (req: RequestWithSession, res: Response) => {
    const session = req.session || {};
    res.redirect('/auth/saml/initiate/slo/' + session.data.tenant);
  }
);

route.get('/common', async (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Logged Out Successfully</title>
      </head>
      <body>
        <h1>You have been logged out.</h1>
        <a href="/">Login Again</a>
      </body>
    </html>
  `);
});

export default route;
