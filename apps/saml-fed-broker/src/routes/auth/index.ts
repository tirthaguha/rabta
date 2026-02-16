import {
  createUserSession,
  RequestWithSession,
  sessionMiddleware,
} from '@rabta/session-manager';
import { Request, Response, Router } from 'express';
import { TENANTS } from '../../config/tenants';
import {
  JWT_SECRET,
  SESSION_DURATION,
  sessionValidationConfig,
  TOKEN_NAME,
} from '../../constants';
import { createIdP } from '../../saml/idpFactory';
import { createSP } from '../../saml/spFactory';

const router = Router();

router.get('/saml/:tenant', async (req: Request, res: Response) => {
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

  const { extract } = await sp.parseLoginResponse(idp, 'post', {
    body: req.body,
  });

  const sessionIndex = extract.sessionIndex;

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

  res.cookie(TOKEN_NAME, session, {
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
  sessionMiddleware(sessionValidationConfig),
  async (req: RequestWithSession, res: Response) => {
    const tenant = req.params.tenant as string;
    if (!tenant || !TENANTS[tenant]) {
      return res.status(400).send('Bad Request');
    }
    const cfg = TENANTS[tenant];

    const nameID = req.session?.userId;
    const sessionIndex = req.session?.data.sessionIndex;

    const idp = createIdP(cfg.idp);
    const sp = createSP(cfg.sp);

    const { context } = await sp.createLogoutRequest(idp, 'redirect', {
      nameID,
      sessionIndex,
    });

    // console.log('context', context);

    res.clearCookie('session_token');
    return res.redirect(context);
  }
);

export default router;
