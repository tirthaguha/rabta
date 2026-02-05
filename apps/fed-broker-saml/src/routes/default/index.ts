import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Login</title>
      </head>
      <body>
        <h1>Login</h1>
        <a href="/auth/saml/keycloak">Login with SAML</a>
      </body>
    </html>
  `);
});

export default router;
