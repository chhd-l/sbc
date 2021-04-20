import Common from './config-common';
export default {
  /* dev */
  // HOST: 'http://124.71.151.9:8390',

  /* stg */
  //HOST: 'https://storestg.royalcanin.com/api',

  /* product */
  //HOST: 'https://eurostore.royalcanin.com/api',


  CDN_PATH: '/',
  ...Common,
  VALET_ORDER_URL:(country)=>`https://shopuat.466920.com/${country}/`,
  VALET_ORDER_NOMAL_URL:'https://shopstg.royalcanin.com/'
};
