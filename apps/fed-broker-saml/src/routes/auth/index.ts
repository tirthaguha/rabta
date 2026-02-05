import { createUserSession } from '@rabta/user-session-manager';
import { Request, Response, Router } from 'express';
import { TENANTS } from '../../config/tenants';
import { createIdP } from '../../saml/idpFactory';
import { createSP } from '../../saml/spFactory';

const JWT_SECRET = 'rZ2W5tN0R3rZ2l7E6yKZJYv9p3Y5v8x1o9HcXzYfG6k=';
const SESSION_DURATION: number = 1800;

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

  const user = {
    id: extract.nameID,
    email: extract.attributes.email?.[0],
    username: extract.attributes.preferred_username?.[0],
  };

  console.log('Authenticated user:', user);

  // req.session.user = user;
  req = { session: { user } } as unknown as Request;

  const session = createUserSession(
    user.id,
    {},
    {
      secret: JWT_SECRET,
      issuer: 'fed-broker-saml',
      expiresIn: SESSION_DURATION,
    }
  );

  // return res.redirect('/dashboard');
  res.cookie('session_token', session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + SESSION_DURATION * 1000),
  });
  // return res.send({ message: 'Login successful', user });
  return res.redirect('/dashboard');
});

export default router;
