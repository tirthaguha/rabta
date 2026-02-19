import { logger } from '@rabta/logger';
import {
  createIdP,
  createSP,
  decodeRequest,
  decodeResponse,
} from '@rabta/saml-utils';
import {
  createUserSession,
  RequestWithSession,
  sessionMiddleware,
} from '@rabta/session-manager';
import { Request, Response, Router } from 'express';
import { TENANTS } from '../../config/tenants';
import {
  certificate,
  JWT_SECRET,
  privateKey,
  SESSION_DURATION,
  sessionValidationConfig,
  TOKEN_NAME,
} from '../../constants';

const router = Router();

router.get('/saml/:tenant', async (req: Request, res: Response) => {
  const tenant = req.params.tenant as string;
  if (!tenant || !TENANTS[tenant]) {
    logger.error(`Invalid tenant: ${tenant}`);
    return res.status(400).send('Bad Request');
  }

  const cfg = TENANTS[tenant];

  const idp = createIdP(cfg.idp);
  const sp = createSP({ ...cfg.sp, certificate, privateKey });

  const { context } = await sp.createLoginRequest(idp, 'redirect');
  logger.info(
    `\nAUTH REQUEST\n${decodeRequest(context.split('?')[1].split('=')[1])}\n`
  );

  return res.redirect(context);
});

router.post('/saml/acs/:tenant', async (req: Request, res: Response) => {
  const tenant = req.params.tenant as string;
  const cfg = TENANTS[tenant];

  if (!tenant || !TENANTS[tenant]) {
    logger.error(`Invalid tenant: ${tenant}`);
    return res.status(400).send('Bad Request');
  }

  const idp = createIdP(cfg.idp);
  const sp = createSP({ ...cfg.sp, certificate, privateKey });

  // logger.info(
  //   '\nAUTH RESPONSE\n',
  //   decodeResponse(req.body?.SAMLResponse),
  //   '\n\n'
  // );

  logger.info(`\nAUTH RESPONSE\n${decodeResponse(req.body?.SAMLResponse)}\n`);

  const { extract } = await sp.parseLoginResponse(idp, 'post', {
    body: req.body,
  });

  const sessionIndex = extract.sessionIndex;

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
  '/saml/initiate/slo/:tenant',
  sessionMiddleware(sessionValidationConfig),
  async (req: RequestWithSession, res: Response) => {
    const tenant = req.params.tenant as string;
    if (!tenant || !TENANTS[tenant]) {
      logger.error(`Invalid tenant: ${tenant}`);
      return res.status(400).send('Bad Request');
    }
    const cfg = TENANTS[tenant];

    const nameID = req.session?.userId;
    const sessionIndex = req.session?.data.sessionIndex;

    const idp = createIdP(cfg.idp);
    const sp = createSP({ ...cfg.sp, certificate, privateKey });

    const { context } = await sp.createLogoutRequest(idp, 'redirect', {
      nameID,
      sessionIndex,
    });

    logger.info(
      `\nnLOGOUT REQUEST\n${decodeRequest(context.split('?')[1].split('=')[1])}\n`
    );

    res.clearCookie('session_token');
    return res.redirect(context);
  }
);

router.get('/saml/slo/:tenant', async (req: Request, res: Response) => {
  const tenant = req.params.tenant as string;
  if (!tenant || !TENANTS[tenant]) {
    logger.error(`Invalid tenant: ${tenant}`);
    return res.status(400).send('Bad Request');
  }
  const cfg = TENANTS[tenant];

  const idp = createIdP(cfg.idp);
  const sp = createSP({ ...cfg.sp, certificate, privateKey });

  logger.info(
    '\nLOGOUT RESPONSE\n',
    decodeRequest(req.query.SAMLResponse as string),
    '\n\n'
  );

  logger.info(
    `\nLOGOUT RESPONSE\n${decodeRequest(req.query.SAMLResponse as string)}\n`
  );

  const { extract } = await sp.parseLogoutResponse(idp, 'redirect', req);

  logger.info('Logout Response Extracted', extract);
  res.clearCookie('session_token');

  return res.redirect('/logout/common');
});

export default router;
