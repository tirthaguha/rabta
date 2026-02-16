import * as xmllint from '@authenio/samlify-node-xmllint';
import fs from 'fs';
import path from 'path';
import * as saml from 'samlify';
import { CERTNAME, KEYNAME } from '../constants';

const certDir = path.join(process.cwd(), 'certs');

const privateKey = fs.readFileSync(path.join(certDir, KEYNAME), 'utf-8');
const certificate = fs.readFileSync(path.join(certDir, CERTNAME), 'utf-8');

// Mandatory
saml.setSchemaValidator(xmllint);

export function createSP(sp: {
  entityId: string;
  acsUrl: string;
  sloUrl: string;
}) {
  return saml.ServiceProvider({
    entityID: sp.entityId,
    privateKey,
    privateKeyPass: '',
    signingCert: certificate,
    wantAssertionsSigned: true,
    allowCreate: true,
    authnRequestsSigned: true,
    wantLogoutRequestSigned: true,
    assertionConsumerService: [
      {
        Binding: saml.Constants.BindingNamespace.Post,
        Location: sp.acsUrl,
        isDefault: true,
      },
    ],
    singleLogoutService: [
      {
        Binding: saml.Constants.BindingNamespace.Redirect,
        Location: sp.sloUrl,
      },
    ],
    nameIDFormat: [saml.Constants.namespace.format.unspecified],
  });
}
