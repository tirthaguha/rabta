import * as xmllint from '@authenio/samlify-node-xmllint';
import * as saml from 'samlify';

saml.setSchemaValidator(xmllint);

export function createIdP(idp: {
  entityId: string;
  ssoRedirectUrl: string;
  ssoPostUrl: string;
  signingCert: string;
}) {
  return saml.IdentityProvider({
    entityID: idp.entityId,
    signingCert: idp.signingCert,
    wantAuthnRequestsSigned: true,
    wantLogoutRequestSigned: true,
    singleSignOnService: [
      {
        Binding: saml.Constants.BindingNamespace.Redirect,
        Location: idp.ssoRedirectUrl,
      },
      {
        Binding: saml.Constants.BindingNamespace.Post,
        Location: idp.ssoPostUrl,
      },
    ],
    singleLogoutService: [
      {
        Binding: saml.Constants.BindingNamespace.Redirect,
        Location: idp.ssoRedirectUrl,
      },
      {
        Binding: saml.Constants.BindingNamespace.Post,
        Location: idp.ssoPostUrl,
      },
    ],
  });
}

export function createSP(sp: {
  entityId: string;
  acsUrl: string;
  sloUrl: string;
  privateKey: string;
  certificate: string;
}) {
  return saml.ServiceProvider({
    entityID: sp.entityId,
    privateKey: sp.privateKey,
    privateKeyPass: '',
    signingCert: sp.certificate,
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
