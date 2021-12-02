import Common from './config-common';

const OKTA_APP_CONFIG = {
  PAYMENT_ENVIRONMENT: 'test',
  REACT_APP_PRESCRIBER_CLIENT_ID: '0oaq5jv1f653OBJn80x6',
  REACT_APP_PRESCRIBER_ISSUER: 'https://accountpreview.royalcanin.com/oauth2/default',
  REACT_APP_PRESCRIBER_RedirectURL: window.origin + '/implicit/callback?type=prescriber',
  REACT_APP_RC_CLIENT_ID: '0oa6fb12ahvn5lAAL357',
  REACT_APP_RC_ISSUER: 'https://mars-group.okta.com',
  REACT_APP_RC_RedirectURL: window.origin + '/implicit/callback?type=staff'
};
const host = window.location.host;
const getOktaAppConfig = () => {
  if (host === 'eurostore.royalcanin.com') {
    return Object.assign({}, OKTA_APP_CONFIG, {
      REACT_APP_PRESCRIBER_CLIENT_ID: '0oa6ac06a7I03dDyY416',
      REACT_APP_PRESCRIBER_ISSUER: 'https://signin.royalcanin.com/oauth2/default',
      REACT_APP_RC_CLIENT_ID: '0oa78y2vww7kzTbiq357',
      PAYMENT_ENVIRONMENT: 'live'
    });
  } else if (host === 'store.royalcanin.com') {
    return Object.assign({}, OKTA_APP_CONFIG, {
      REACT_APP_PRESCRIBER_CLIENT_ID: '0oa6ac06a7I03dDyY416',
      REACT_APP_PRESCRIBER_ISSUER: 'https://signin.royalcanin.com/oauth2/default',
      REACT_APP_RC_CLIENT_ID: '0oa5odnbjhRhbV16X357',
      PAYMENT_ENVIRONMENT: 'live'
    });
  } else if (host.indexOf('myvetreco') > -1) {
    return Object.assign({}, OKTA_APP_CONFIG, {
      REACT_APP_PRESCRIBER_CLIENT_ID: '0oa11rn3i75tj9K6g0h8',
      REACT_APP_PRESCRIBER_ISSUER: 'https://accountdev.royalcanin.com/oauth2/default',
      REACT_APP_PRESCRIBER_RedirectURL: window.origin + '/implicit/callback'
    });
  } else if (host === 'store.peawee.co.uk') {
    return Object.assign({}, OKTA_APP_CONFIG, {
      REACT_APP_PRESCRIBER_ISSUER: 'https://signin.royalcanin.com/oauth2/default',
      REACT_APP_RC_CLIENT_ID: '0oadfnmb3ako9BaIh357',
      PAYMENT_ENVIRONMENT: 'live'
    });
  } else {
    return OKTA_APP_CONFIG;
  }
};
const _config = {
  'storesit.royalcanin.com': {
    SHOPDOMINDE: 'https://shopsit.royalcanin.com/de',
    ISPRODUCT: false,
    PAYMENT: {
      ru: {
        app_id: 'com.razorfish.sit_ms_ru',
        key: '0f7c56c2-e372-4aa4-8649-d89f4fb467cd'
      },
      tr: {
        app_id: 'com.razorfish.sit_iyzico_tr',
        key: '706da6b5-949a-44e9-95ae-d42b24382f71'
      },
      de: {
        app_id: 'ROYALCAIN_GERMANY_D2C',
        key: 'pub.v2.8015632026961356.aHR0cHM6Ly9zdG9yZXNpdC5yb3lhbGNhbmluLmNvbQ.2dKUkAYcc6N_ZLnqIXeWPSxt14cFPMs0X_LJM0IBA2Q'
      },
      fr: {
        app_id: 'ROYALCAIN_GERMANY_D2C',
        key: 'pub.v2.8015632026961356.aHR0cHM6Ly9zdG9yZXNpdC5yb3lhbGNhbmluLmNvbQ.2dKUkAYcc6N_ZLnqIXeWPSxt14cFPMs0X_LJM0IBA2Q'
      }
    }
  },
  'storestg.royalcanin.com': {
    SHOPDOMINDE: 'https://shopstg.royalcanin.com/de',
    ISPRODUCT: false,
    PAYMENT: {
      ru: {
        app_id: 'com.razorfish.stg_ms_ru',
        key: '362c93e4-9865-4255-bffb-e888468e9dd2'
      },
      tr: {
        app_id: 'com.razorfish.stg_iyzico_tr',
        key: '7c340ecb-962b-4660-b663-78b66f790797'
      },
      de: {
        app_id: 'ROYALCANIN_GERMANY_D2C',
        key: 'pub.v2.8015632026961356.aHR0cHM6Ly9zdG9yZXN0Zy5yb3lhbGNhbmluLmNvbQ._SI921RC_7nOpBTbi513hsM38WXLvY55InUJ_KkBHg8'
      },
      fr: {
        app_id: 'ROYALCANIN_FRANCE_D2C',
        key: 'pub.v2.8015632026961356.aHR0cHM6Ly9zdG9yZXN0Zy5yb3lhbGNhbmluLmNvbQ._SI921RC_7nOpBTbi513hsM38WXLvY55InUJ_KkBHg8'
      }
    }
  },
  'storeuat.royalcanin.com': {
    SHOPDOMINDE: 'https://shopuat.royalcanin.com/de',
    ISPRODUCT: false,
    PAYMENT: {
      ru: {
        app_id: 'com.razorfish.uat_ru_ms',
        key: 'd594bb10-fb1f-49f2-9a82-8edea0407ceb'
      },
      tr: {
        app_id: 'com.razorfish.uat_iyzico',
        key: '066b7c52-daba-4aeb-8c4a-9074d85f2adc'
      },
      de: {
        app_id: 'MarsIncorporated_ROYALCANIN_GERMANY_D2C_UAT_TEST',
        key: 'pub.v2.8015632026961356.aHR0cHM6Ly9zdG9yZXVhdC5yb3lhbGNhbmluLmNvbQ._gQyfk5nAPLML12ddHCBO7H3IkcPaIxxoHYahGniDJ4'
      },
      fr: {
        app_id: 'MarsIncorporated_ROYALCANIN_FRANCE_D2C_UAT_TEST',
        key: 'pub.v2.8015632026961356.aHR0cHM6Ly9zdG9yZXVhdC5yb3lhbGNhbmluLmNvbQ._gQyfk5nAPLML12ddHCBO7H3IkcPaIxxoHYahGniDJ4'
      }
    }
  },
  'eurostore.royalcanin.com': {
    SHOPDOMINDE: 'https://shop.royalcanin.de',
    ISPRODUCT: true,
    PAYMENT: {
      ru: {
        app_id: 'com.razorfish.fgs_ru',
        key: 'dbc13b9e-9bc9-4023-8c1e-8a0de080a0a4'
      },
      tr: {
        app_id: 'com.razorfish.fgs_tr_ms',
        key: '13c0bad7-420a-43bd-8784-3402a1f270ce'
      },
      de: {
        app_id: 'MarsIncorporated_ROYALCANIN_GERMANY_D2C_UAT_TEST',
        key: 'pub.v2.4116105963663555.aHR0cHM6Ly9ldXJvc3RvcmUucm95YWxjYW5pbi5jb20.sEPXI2OxOklPsU8l6m_n8E2oSZ34aXvMflvSSSJWXEs'
      },
      fr: {
        app_id: 'MarsIncorporated_ROYALCANIN_FRANCE_D2C_UAT_TEST',
        key: 'pub.v2.4116105963663555.aHR0cHM6Ly9ldXJvc3RvcmUucm95YWxjYW5pbi5jb20.sEPXI2OxOklPsU8l6m_n8E2oSZ34aXvMflvSSSJWXEs'
      }
    }
  },
  'store.royalcanin.com': {}
};

const SITE_NAME = host.indexOf('myvetreco') > -1 ? 'MYVETRECO' : 'RC';

//配置colors值方便js中读取
const COLORS = {
  PRIMARY_COLOR: SITE_NAME === 'MYVETRECO' ? '#448bff' : '#e2001a',
  PRIMARY_COLOR_1: SITE_NAME === 'MYVETRECO' ? '#8cb4f7' : '#f5828e'
};

export default {
  HOST: '/api',
  CDN_PATH: '/',
  ...Common,
  // Okta Config
  ..._config[host],
  ...getOktaAppConfig(),
  SITE_NAME,
  COLORS
};
