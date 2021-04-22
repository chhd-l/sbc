const Common = {
  // 当前版本号
  COPY_VERSION: 'SBC V1.18.0',
  HTTP_TIME_OUT: 10,
  DAY_FORMAT: 'YYYY-MM-DD',
  DATE_FORMAT_HOUR: 'YYYY-MM-DD HH',
  DATE_FORMAT: 'YYYY-MM-DD HH:mm',
  TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DATE_FORMAT_SECOND: 'HH:mm:ss',
  SUCCESS_CODE: 'K-000000',

  // 商品审核状态
  goodsState: {
    0: '待审核',
    1: 'Audited',
    2: '审核未通过',
    3: 'No sale'
  },

  // 退货状态
  returnGoodsState: {
    INIT: '待审核',
    AUDIT: 'Logistics information to be filled in',
    DELIVERED: '待商家收货',
    RECEIVED: 'Pending refund',
    COMPLETED: 'Finished',
    REJECT_RECEIVE: '拒绝收货',
    REJECT_REFUND: '拒绝退款',
    VOID: 'Invalid',
    REFUND_FAILED: '退款失败'
  },
  // 退款状态
  returnMoneyState: {
    INIT: '待审核',
    AUDIT: 'Pending refund',
    COMPLETED: 'Finished',
    REJECT_REFUND: '拒绝退款',
    VOID: 'Invalid',
    REFUND_FAILED: '退款失败'
  },
  // 退款单状态
  refundStatus: {
    0: 'Pending refund',
    3: 'Pending refund',
    1: '拒绝退款',
    2: 'Refund'
  },
  // 支付方式
  payType: {
    0: 'Online payment',
    1: '转账汇款'
  },
  // 设价方式
  priceType: {
    0: '按客户设价',
    1: 'Set price for order quantity',
    2: 'Sell at market prices'
  },
  // 平台类型
  platform: {
    BOSS: '平台',
    MERCHANT: '商户',
    THIRD: '第三方',
    CUSTOMER: '客户' //C用户
  },

  // 发货状态
  deliverStatus: {
    NOT_YET_SHIPPED: 'Not yet shipped',
    SHIPPED: 'Shipped',
    PART_SHIPPED: 'Part shipped',
    VOID: 'void'
  },

  // 支付状态
  payState: {
    NOT_PAID: 'Not paid',
    PARTIAL_PAID: 'Partial paid',
    PAID: 'Paid'
  },
  // 优惠券使用范围
  couponScopeType: {

    0: 'All products',
    1: 'Limited brand',
    2: 'Restricted category', //平台分类
    3: 'Limited store classification', //店铺分类
    4: 'Some commodities'
  },
  // // 优惠券查询类型
  // couponStatus: {
  //   0: 'all',
  //   1: 'in effect',
  //   2: 'not effective',
  //   3: 'Take effect ',
  //   4: 'invalid'


  // },
  // 优惠券查询类型
  couponStatus: {
    0: 'All',
    1: 'In effect',
    2: 'Not active',
    3: 'Take effect',
    4: 'Expired'
  },
  activityStatus: {
    0: 'All',
    1: 'In process',
    2: 'Pause',
    3: 'Not start',
    4: 'Completed',
    5: 'Not start and in process'
  },
  couponActivityType: {
    0: '全场赠券',
    1: '精准发券',
    2: '进店赠券',
    3: '注册赠券'
  },

  // 统计模块，companyId的常量...
  platformDefaultId: 1,

  // 文件大小
  fileSize: {
    // 2M
    TWO: 2 * 1024 * 1024
  },

  spuMaxSku: 50,

  // STG  Okta Config
  REACT_APP_PRESCRIBER_CLIENT_ID: "0oaq5jv1f653OBJn80x6",
  REACT_APP_PRESCRIBER_ISSUER : "https://accountpreview.royalcanin.com/oauth2/default",
  REACT_APP_PRESCRIBER_RedirectURL: window.origin +  "/implicit/callback?type=prescriber",
  REACT_APP_RC_CLIENT_ID: "0oa6fb12ahvn5lAAL357",
  REACT_APP_RC_ISSUER : "https://mars-group.okta.com",
  REACT_APP_RC_RedirectURL: window.origin + "/implicit/callback?type=staff",
  VALET_ORDER_URL:(country)=>`https://stgwedding.royalcanin.com/${country}/shop/`,
  VALET_ORDER_NOMAL_URL:'https://shopstg.royalcanin.com/',

  // PROD  Okta Config
  // REACT_APP_PRESCRIBER_CLIENT_ID: "0oa6ac06a7I03dDyY416",
  // REACT_APP_PRESCRIBER_ISSUER : "https://signin.royalcanin.com/oauth2/default",
  // REACT_APP_PRESCRIBER_RedirectURL: window.origin +  "/implicit/callback?type=prescriber",
  // REACT_APP_RC_CLIENT_ID: "0oa78y2vww7kzTbiq357",
  // REACT_APP_RC_ISSUER : "https://mars-group.okta.com",
  // REACT_APP_RC_RedirectURL: window.origin + "/implicit/callback?type=staff",

  // DEV RC STAFF Okta Config
  // REACT_APP_RC_CLIENT_ID: "0oazb1qrtg8k0aKCP4x6",
  // REACT_APP_RC_ISSUER : "https://dev-476019.okta.com/oauth2/default",
  // REACT_APP_RC_RedirectURL: window.origin +  "/implicit/callback",

  // PROD MX RC STAFF Okta Config
  // REACT_APP_RC_CLIENT_ID: "0oa5odnbjhRhbV16X357",
  // REACT_APP_RC_ISSUER : "https://mars-group.okta.com",
  // REACT_APP_RC_RedirectURL: window.origin + "/implicit/callback?type=staff",

};
export default Common;
