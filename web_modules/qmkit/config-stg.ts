import Common from './config-common';
export default {
  HOST: 'https://storestg.royalcanin.com/api',
  CDN_PATH: 'https://cdnstorestg.azureedge.net/res/',
  ...Common,
  // STG  Okta Config
  REACT_APP_PRESCRIBER_CLIENT_ID: "0oaq5jv1f653OBJn80x6",
  REACT_APP_PRESCRIBER_ISSUER: "https://accountpreview.royalcanin.com/oauth2/default",
  REACT_APP_PRESCRIBER_RedirectURL: window.origin + "/implicit/callback?type=prescriber",
  REACT_APP_RC_CLIENT_ID: "0oa6fb12ahvn5lAAL357",
  REACT_APP_RC_ISSUER: "https://mars-group.okta.com",
  REACT_APP_RC_RedirectURL: window.origin + "/implicit/callback?type=staff",
  PAYMENT: {
    "ru": {
      "app_id": "com.razorfish.stg_ms_ru",
      "key": "362c93e4-9865-4255-bffb-e888468e9dd2",
    },
    "tr": {
      "app_id": "com.razorfish.stg_iyzico_tr",
      "key": "7c340ecb-962b-4660-b663-78b66f790797"
    },
    'de':{
      app_id:'ROYALCANIN_GERMANY_D2C',
      key:'pub.v2.8015632026961356.aHR0cHM6Ly9zdG9yZXN0Zy5yb3lhbGNhbmluLmNvbQ._SI921RC_7nOpBTbi513hsM38WXLvY55InUJ_KkBHg8'
    },
    'fr':{
      app_id:'ROYALCANIN_FRANCE_D2C',
      key:'pub.v2.8015632026961356.aHR0cHM6Ly9zdG9yZXN0Zy5yb3lhbGNhbmluLmNvbQ._SI921RC_7nOpBTbi513hsM38WXLvY55InUJ_KkBHg8'
    }
  }
};
