/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-02 13:11:00
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-02 13:38:00
 * @FilePath: \sbc-supplier-front\web_modules\qmkit\config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Common from './config-common';

const host = window.location.host;
const SITE_NAME = host.indexOf('myvetreco') > -1 ? 'MYVETRECO' : 'RC';

//配置colors值方便js中读取
const COLORS = {
  PRIMARY_COLOR: SITE_NAME === 'MYVETRECO' ? '#448bff' : '#e2001a',
  PRIMARY_COLOR_1: SITE_NAME === 'MYVETRECO' ? '#8cb4f7' : '#f5828e',
};

export default {
  /* dev */
  // HOST: 'https://121.36.199.41:8390',

  /* stg */
  HOST: 'https://storesit.royalcanin.com/api',
  PAYMENT_ENVIRONMENT:'test',
  /* product */
  //HOST: 'https://eurostore.royalcanin.com/api',
  ISPRODUCT: false,

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
