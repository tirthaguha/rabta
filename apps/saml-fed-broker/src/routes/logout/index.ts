import { RequestWithSession, sessionMiddleware } from '@rabta/session-manager';
import { Request, Response, Router } from 'express';

const route = Router();

route.get(
  '/',
  sessionMiddleware({
    secret: 'rZ2W5tN0R3rZ2l7E6yKZJYv9p3Y5v8x1o9HcXzYfG6k=',
    issuer: 'saml-fed-broker',
    tokenSource: { type: 'cookie', name: 'session_token' },
  }),
  async (req: RequestWithSession, res: Response) => {
    const session = req.session || {};

    // console.log('req.session', session);
    // console.log('req.session tenant', session.data.tenant);

    // res.send({ message: 'Logged out successfully' });

    res.redirect('/auth/saml/slo/' + session.data.tenant);
  }
);

route.get(
  '/common',

  async (req: Request, res: Response) => {
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
  }
);

export default route;
