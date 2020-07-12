import Common from './config-common';
export default {
  // dev
  HOST: process.env.NODE_ENV != 'production' ? 'http://121.37.129.70:8390' : 'http://52.168.31.130:8390',
  //HOST: process.env.NODE_ENV != 'production' ? 'https://store.royalcanin.com/api' : 'https://store.royalcanin.com/api',
  ...Common
};
