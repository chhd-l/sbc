import Common from './config-common';
export default {
  /* dev */
  // HOST: 'http://124.71.151.9:8390',

  /* stg */
  //HOST: 'https://storestg.royalcanin.com/api',
  /* sit */
  HOST: 'https://storesit.royalcanin.com/api',
  PAYMENT_ENVIRONMENT:'test',
  /* product */
  //HOST: 'https://eurostore.royalcanin.com/api',

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
      key:'pub.v2.8015632026961356.aHR0cDovL2xvY2FsaG9zdDozMDAy.BQDRrmDX7NdBXUAZq_wvnpq1EPWjdxJ8MQIanwrV2XQ'
    },
    'fr':{
      app_id:'ROYALCAIN_GERMANY_D2C',
      key:'pub.v2.8015632026961356.aHR0cDovL2xvY2FsaG9zdDozMDAy.BQDRrmDX7NdBXUAZq_wvnpq1EPWjdxJ8MQIanwrV2XQ'
    }
  },
  CDN_PATH: '/',
  ...Common,
  SITE_NAME: window.location.host.indexOf('myvetreco') > -1 ? 'MYVETRECO' : 'RC',
};
