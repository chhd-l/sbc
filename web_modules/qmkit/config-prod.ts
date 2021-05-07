import Common from './config-common';

const OKTA_APP_CONFIG = {
  REACT_APP_PRESCRIBER_CLIENT_ID: "0oaq5jv1f653OBJn80x6",
  REACT_APP_PRESCRIBER_ISSUER : "https://accountpreview.royalcanin.com/oauth2/default",
  REACT_APP_PRESCRIBER_RedirectURL: window.origin +  "/implicit/callback?type=prescriber",
  REACT_APP_RC_CLIENT_ID: "0oa6fb12ahvn5lAAL357",
  REACT_APP_RC_ISSUER : "https://mars-group.okta.com",
  REACT_APP_RC_RedirectURL: window.origin + "/implicit/callback?type=staff"
};

const getOktaAppConfig = () => {
  const host = window.location.host;
  if (host === 'eurostore.royalcanin.com') {
    return Object.assign({}, OKTA_APP_CONFIG, {
      REACT_APP_PRESCRIBER_CLIENT_ID: "0oa6ac06a7I03dDyY416",
      REACT_APP_PRESCRIBER_ISSUER : "https://signin.royalcanin.com/oauth2/default",
      REACT_APP_RC_CLIENT_ID: "0oa78y2vww7kzTbiq357"
    });
  } else if (host === 'store.royalcanin.com') {
    return Object.assign({}, OKTA_APP_CONFIG, {
      REACT_APP_PRESCRIBER_CLIENT_ID: "0oa6ac06a7I03dDyY416",
      REACT_APP_PRESCRIBER_ISSUER : "https://signin.royalcanin.com/oauth2/default",
      REACT_APP_RC_CLIENT_ID: "0oa5odnbjhRhbV16X357"
    });
  } else {
    return OKTA_APP_CONFIG;
  }
};


export default {
  HOST: '/api',
  CDN_PATH: '/',
  ...Common,
  // Okta Config
  ...getOktaAppConfig()
};
