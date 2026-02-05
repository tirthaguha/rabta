import { Router } from 'express';
import { TENANTS } from '../../config/tenants';
import { createSP } from '../../saml/spFactory';

const router = Router();

/**
 * SP metadata endpoint
 * GET /saml/metadata/:tenant
 */
router.get('/metadata/:tenant', (req, res) => {
  const tenant = req.params.tenant;
  const cfg = TENANTS[tenant];

  if (!cfg) {
    return res.status(404).send('Unknown tenant');
  }

  const sp = createSP(cfg.sp);

  const metadata = sp.getMetadata();

  res.type('application/xml');
  return res.send(metadata);
});

export default router;
