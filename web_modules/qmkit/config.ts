import Common from './config-common';
export default {
  /* dev */
  HOST: 'http://124.71.151.9:8390',

  /* stg */
  //HOST: 'https://storestg.royalcanin.com/api',

  /* product */
  //HOST: 'https://eurostore.royalcanin.com/api',
  PAYMENT:{
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
    key:"pub.v2.8015632026961356.aHR0cDovL2xvY2FsaG9zdDozMDAy.BQDRrmDX7NdBXUAZq_wvnpq1EPWjdxJ8MQIanwrV2XQ"
  },
  'fr':{
    app_id:'ROYALCAIN_GERMANY_D2C',
    key:"pub.v2.8015632026961356.aHR0cDovL2xvY2FsaG9zdDozMDAy.BQDRrmDX7NdBXUAZq_wvnpq1EPWjdxJ8MQIanwrV2XQ"
  },
  },
  CDN_PATH: '/',
  ...Common
};
