import Common from './config-common';
export default {
  HOST: 'https://storeuat.royalcanin.com/api',
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
      "app_id": "com.razorfish.uat_ru_ms",
      "key": "d594bb10-fb1f-49f2-9a82-8edea0407ceb",
    },
    "tr": {
      "app_id": "com.razorfish.uat_iyzico",
      "key": "066b7c52-daba-4aeb-8c4a-9074d85f2adc"
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
