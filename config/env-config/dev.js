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
  HOST: 'https://124.71.151.9:8390',

  /* stg */
  //HOST: 'https://storestg.royalcanin.com/api',

  /* product */
  //HOST: 'https://eurostore.royalcanin.com/api',


  CDN_PATH: '/',
  ...Common
};
