import Common from './config-common';
export default {
  HOST: 'https://storesit.royalcanin.com/api',
  CDN_PATH: '/',
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
      "app_id": "com.razorfish.sit_ms_ru",
      "key": "0f7c56c2-e372-4aa4-8649-d89f4fb467cd",
    },
    "tr": {
      "app_id": "com.razorfish.sit_iyzico_tr",
      "key": "706da6b5-949a-44e9-95ae-d42b24382f71"
    },
    'de':{
      app_id:'ROYALCAIN_GERMANY_D2C',
      key:'AQErhmfuXNWTK0Qc+iSdk3YrjuqYR5ldAoFLTGBSrF51ENJOAzIOrvI655613hDBXVsNvuR83LVYjEgiTGAH-1IAk3WNsFHn9OQTCs1zqAgfITuuhrk2BSWACax6iq4g=-~7C;smxATY88pe*7'
    },
    'fr':{
      app_id:'ROYALCAIN_GERMANY_D2C',
      key:'AQErhmfuXNWTK0Qc+iSdk3YrjuqYR5ldAoFLTGBSrF51ENJOAzIOrvI655613hDBXVsNvuR83LVYjEgiTGAH-1IAk3WNsFHn9OQTCs1zqAgfITuuhrk2BSWACax6iq4g=-~7C;smxATY88pe*7'
    }
  }
};
