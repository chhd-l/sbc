import Common from './config-common';
export default {
  /* dev */
  HOST: 'http://124.71.151.9:8390',

  /* stg */
  //HOST: 'https://storeuat.royalcanin.com/api',

  /* product */
  //HOST: 'https://eurostore.royalcanin.com/api',

  // PAYMENT: {
  //   "ru_payu": {
  //     "app_id": "com.razorfish.sit_ms_ru",
  //     "public_key": "0f7c56c2-e372-4aa4-8649-d89f4fb467cd",
  //   },
  //   "tu_payu": {
  //     "app_id": "com.razorfish.sit_iyzico_tr",
  //     "public_key": "706da6b5-949a-44e9-95ae-d42b24382f71"
  //   }
  // },
  PAYMENT: {
    "ru": {
      "app_id": "com.razorfish.uat_ru_ms",
      "key": "d594bb10-fb1f-49f2-9a82-8edea0407ceb",
    },
    "tu": {
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
  },
  CDN_PATH: '/',
  ...Common
};
