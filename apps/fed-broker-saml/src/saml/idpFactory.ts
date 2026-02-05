import * as saml from "samlify";

export function createIdP(idp: { entityId: string; ssoRedirectUrl: string; ssoPostUrl: string; signingCert: string }) {
  return saml.IdentityProvider({
    entityID: idp.entityId,
    signingCert: idp.signingCert,
    wantAuthnRequestsSigned: true,
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
  });
}
