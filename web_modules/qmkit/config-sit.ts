import Common from './config-common';
export default {
  HOST: 'https://storesit.royalcanin.com/api',
  CDN_PATH: '/',
  ...Common,
  // STG  Okta Config
  REACT_APP_PRESCRIBER_CLIENT_ID: "0oaq5jv1f653OBJn80x6",
  REACT_APP_PRESCRIBER_ISSUER : "https://accountpreview.royalcanin.com/oauth2/default",
  REACT_APP_PRESCRIBER_RedirectURL: window.origin +  "/implicit/callback",
  REACT_APP_RC_CLIENT_ID: "0oa6fb12ahvn5lAAL357",
  REACT_APP_RC_ISSUER : "https://mars-group.okta.com",
  REACT_APP_RC_RedirectURL: window.origin + "/implicit/callback?type=staff",
};
