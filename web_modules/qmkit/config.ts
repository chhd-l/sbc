import Common from './config-common';

const host = window.location.host;
const SITE_NAME = 'MYVETRECO';

//配置colors值方便js中读取
const COLORS = {
  PRIMARY_COLOR: SITE_NAME === 'MYVETRECO' ? '#448bff' : '#e2001a',
  PRIMARY_COLOR_1: SITE_NAME === 'MYVETRECO' ? '#8cb4f7' : '#f5828e',
};

export default {
  /* dev */
  // HOST: 'http://121.36.199.41:8390',
  HOST: 'https://storestg.royalcanin.com/api',
  /* stg */
  //HOST: 'https://storestg.royalcanin.com/api',
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
  SITE_NAME,
  COLORS,
};
