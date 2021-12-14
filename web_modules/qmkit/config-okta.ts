import Config from './config';

const CLIENT_PRESCRIBER_ID = Config.REACT_APP_PRESCRIBER_CLIENT_ID
const PRESCRIBER_ISSUER = Config.REACT_APP_PRESCRIBER_ISSUER
const REACT_APP_PRESCRIBER_RedirectURL = Config.REACT_APP_PRESCRIBER_RedirectURL

const CLIENT_RC_ID = Config.REACT_APP_RC_CLIENT_ID
const RC_ISSUER = Config.REACT_APP_RC_ISSUER
const REACT_APP_RC_RedirectURL = Config.REACT_APP_RC_RedirectURL

const REACT_APP_PRESCRIBER_Scope = Config.REACT_APP_PRESCRIBER_Scope
const REACT_APP_RC_Scope = Config.REACT_APP_RC_Scope

const OKTA_TESTING_DISABLEHTTPSCHECK = false;

const configOkta = {
  prescrberOidc: {
    clientId: CLIENT_PRESCRIBER_ID,
    issuer: PRESCRIBER_ISSUER,
    redirectUri: REACT_APP_PRESCRIBER_RedirectURL,
    // scopes: ['openid', 'profile', 'email','user.consent:read','user.profile:write','user.consent:delete','user.consent:collect'],
    scopes: REACT_APP_PRESCRIBER_Scope,
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
  },

  RcOidc: {
    clientId: CLIENT_RC_ID,
    issuer: RC_ISSUER,
    redirectUri: REACT_APP_RC_RedirectURL,
    // scopes: ['openid', 'profile', 'email'],
    scopes: REACT_APP_RC_Scope,
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
  },
};
export default configOkta;
