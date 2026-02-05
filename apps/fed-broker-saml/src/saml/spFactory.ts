import fs from 'fs';
import path from 'path';
import * as saml from 'samlify';

const certDir = path.join(process.cwd(), 'certs');
// console.log('certDir', certDir);

const privateKey = fs.readFileSync(path.join(certDir, 'sp.key'), 'utf-8');

const certificate = fs.readFileSync(path.join(certDir, 'sp.crt'), 'utf-8');

import * as xmllint from '@authenio/samlify-node-xmllint';

// Mandatory
saml.setSchemaValidator(xmllint);

export function createSP(sp: { entityId: string; acsUrl: string }) {
  return saml.ServiceProvider({
    entityID: sp.entityId,
    privateKey,
    privateKeyPass: '',
    signingCert: certificate,
    wantAssertionsSigned: true,
    allowCreate: true,
    authnRequestsSigned: true,
    assertionConsumerService: [
      {
        Binding: saml.Constants.BindingNamespace.Post,
        Location: sp.acsUrl,
        isDefault: true,
      },
    ],
  });
}
