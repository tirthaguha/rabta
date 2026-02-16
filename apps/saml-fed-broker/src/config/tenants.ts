export type TenantConfig = {
  slug: string;
  idp: {
    entityId: string;
    ssoRedirectUrl: string;
    ssoPostUrl: string;
    signingCert: string;
    sloPostUrl: string;
    sloRedirectUrl: string;
  };
  sp: {
    entityId: string;
    acsUrl: string;
    sloUrl: string;
  };
};

export const TENANTS: Record<string, TenantConfig> = {
  keycloak: {
    slug: 'id-fed-system',
    idp: {
      entityId: 'http://localhost:8080/realms/id-fed-system',
      ssoRedirectUrl:
        'http://localhost:8080/realms/id-fed-system/protocol/saml',
      ssoPostUrl: 'http://localhost:8080/realms/id-fed-system/protocol/saml',
      signingCert: `-----BEGIN CERTIFICATE-----
MIICqTCCAZECBgGb7wNUtTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1pZC1mZWQtc3lzdGVtMB4XDTI2MDEyNDA3NTcxMVoXDTM2MDEyNDA3NTg1MVowGDEWMBQGA1UEAwwNaWQtZmVkLXN5c3RlbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJ+geN1G7qNFA8TbVOL34LsaOnTD80+BZSndR0E6YFIK3Wmehfa6Cu+MztdG4Vxu8wjrTR5AUm254oILj7jxPpnmuEBR+/ur4HX2hgSmhCPEfAcY5xIEHFofocnL0MvKNCrYLqvtI1p1R+LKjyq877WWbh2DdJ8Hz9r7njXq5039cMuRNG5b5dQk7O9GmtwzsFWHSwEE05Hc9IXTutTKNLupa/H3dy/6wYSbKC4Z3AvgEekEb2QZd81qALbFdX4BYe6IAK89FfDfbe0lppV34Wzqzsicj2VmAPIKNDaypgX9l12ClGMsopcnWYI281Rfx/ya5sOkSP4+9RcNGTnTc6MCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEACZNbkCMpfYHiPlJuyx4yhP/3jI8YrQcpUV5rbaho9AQR8jh7J6FsoMBAd+zdhM0DCXfpJZFUJhEkaJ29jDAYhZ0ylzEVfZfZSdcZpTlxAoOpzhOt4gDsS/bxZ2X289V5Ns0JhSl7VsbUC6TnSttMz/PYnnipGqyxYo3ho8S2I1il7092FDfaKDr35Y0lhR5qmnaTnubwi9Zi3pYZ9tzjGk0eOxo7PnXaZXcDdJBm6pNZhOrcTMdJClqx86q+aApDxKRfRExfhczFpCA7veXFKPscpPdjbqWjfBTImT9G5o+argQhhxMhqfIrOllWDjST2l3rN0A/2Sck1ahyxaFtFA==
-----END CERTIFICATE-----`,
      sloPostUrl: 'http://localhost:8080/realms/id-fed-system/protocol/saml',
      sloRedirectUrl:
        'http://localhost:8080/realms/id-fed-system/protocol/saml',
    },
    sp: {
      entityId: 'http://localhost:3000/auth/saml/sp',
      acsUrl: 'http://localhost:3000/auth/saml/acs/keycloak',
      sloUrl: 'http://localhost:3000/logout/common',
    },
  },
};
