/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2019/5/8
 **/

var Common = require('./common');

module.exports = {
  /* dev */
  HOST: 'http://124.71.151.9:8390',

  /* stg */
  //HOST: 'https://storestg.royalcanin.com/api',

  /* product */
  //HOST: 'http://eurostore.royalcanin.com/api',


  CDN_PATH: '',
  X_XITE_ADMIN_HOST: 'http://121.37.129.70:3000',
  X_XITE_OPEN_HOST: 'http://121.37.129.70:3000',
  ...Common
};
