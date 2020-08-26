import Config from './config';

const CLIENT_ID = Config.REACT_APP_CLIENT_ID
const ISSUER = Config.REACT_APP_ISSUER
const OKTA_TESTING_DISABLEHTTPSCHECK = false;
const REACT_APP_RedirectURL = Config.REACT_APP_RedirectURL

const configOkta = {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REACT_APP_RedirectURL || 'http://localhost:3002/implicit/callback',
    scopes: ['openid', 'profile', 'email','user.consent:read','user.profile:write','user.consent:delete','user.consent:collect'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
  },
  resourceServer: {
    messagesUrl: 'https://shopuat.466920.com/api/messages',
  },
};
export default configOkta;
