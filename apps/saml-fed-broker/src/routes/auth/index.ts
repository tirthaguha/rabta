import {
  createUserSession,
  RequestWithSession,
  sessionMiddleware,
} from '@rabta/session-manager';
import { Request, Response, Router } from 'express';
import { TENANTS } from '../../config/tenants';
import { createIdP } from '../../saml/idpFactory';
import { createSP } from '../../saml/spFactory';

const JWT_SECRET = 'rZ2W5tN0R3rZ2l7E6yKZJYv9p3Y5v8x1o9HcXzYfG6k=';
const SESSION_DURATION = 1800;

const router = Router();

router.get('/saml/:tenant', async (req: Request, res: Response) => {
  // return res.status(400).send("Bad Request");
  const tenant = req.params.tenant as string;
  if (!tenant || !TENANTS[tenant]) {
    return res.status(400).send('Bad Request');
  }

  const cfg = TENANTS[tenant];

  const idp = createIdP(cfg.idp);
  const sp = createSP(cfg.sp);

  const { context } = await sp.createLoginRequest(idp, 'redirect');

  return res.redirect(context);
});

router.post('/saml/acs/:tenant', async (req: Request, res: Response) => {
  const tenant = req.params.tenant as string;
  if (!tenant) return res.status(400).send('Invalid tenant');
  const cfg = TENANTS[tenant];

  const idp = createIdP(cfg.idp);
  const sp = createSP(cfg.sp);

  // console.log('req.body', JSON.stringify(req.body, null, 2));

  const { extract } = await sp.parseLoginResponse(idp, 'post', {
    body: req.body,
  });

  const sessionIndex = extract.sessionIndex;

  // console.log('/saml/acs sessionIndex', sessionIndex);
  console.log('/saml/acs extract', extract);

  const user = {
    id: extract.nameID,
    email: extract.attributes.email,
    username: extract.nameID,
    name: extract.attributes.firstname + ' ' + extract.attributes.lastname,
    sp,
    idp,
    sessionIndex,
  };

  const session = createUserSession(
    user.id,
    { sessionIndex, tenant: tenant },
    {
      secret: JWT_SECRET,
      issuer: 'saml-fed-broker',
      expiresIn: SESSION_DURATION,
    }
  );

  // return res.redirect('/dashboard');
  // console.log('session', session);

  res.cookie('session_token', session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + SESSION_DURATION * 1000),
  });
  // return res.send({ message: 'Login successful', user });
  return res.redirect('/dashboard');
});

router.get(
  '/saml/slo/:tenant',
  sessionMiddleware({
    secret: 'rZ2W5tN0R3rZ2l7E6yKZJYv9p3Y5v8x1o9HcXzYfG6k=',
    issuer: 'saml-fed-broker',
    tokenSource: { type: 'cookie', name: 'session_token' },
  }),
  async (req: RequestWithSession, res: Response) => {
    const tenant = req.params.tenant as string;
    if (!tenant || !TENANTS[tenant]) {
      return res.status(400).send('Bad Request');
    }
    const cfg = TENANTS[tenant];

    // const session = req.session || {};
    const nameID = req.session?.userId;
    const sessionIndex = req.session?.data.sessionIndex;

    const idp = createIdP(cfg.idp);
    const sp = createSP(cfg.sp);

    const { context } = await sp.createLogoutRequest(idp, 'redirect', {
      nameID,
      sessionIndex,
    });

    console.log('context', context);

    // return res.send({ message: 'Logout successful' });
    res.clearCookie('session_token');
    return res.redirect(context);
  }
);

export default router;
