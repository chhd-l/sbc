import Common from './config-common';
export default {
  HOST: 'https://eurostore.royalcanin.com/api',
  CDN_PATH: '/',
  //CDN_PATH: 'https://d2cde.azureedge.net/rs/',
  ...Common,
  // PROD  Okta Config
  REACT_APP_PRESCRIBER_CLIENT_ID: "0oa6ac06a7I03dDyY416",
  REACT_APP_PRESCRIBER_ISSUER : "https://signin.royalcanin.com/oauth2/default",
  REACT_APP_PRESCRIBER_RedirectURL: window.origin +  "/implicit/callback?type=prescriber",
  REACT_APP_RC_CLIENT_ID: "0oa78y2vww7kzTbiq357",
  REACT_APP_RC_ISSUER : "https://mars-group.okta.com",
  REACT_APP_RC_RedirectURL: window.origin + "/implicit/callback?type=staff"
};
