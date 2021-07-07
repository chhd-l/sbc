import { LoginCallback } from '@okta/okta-react';

const routes = [
  //首页
  { path: '/', exact: true, asyncComponent: () => import('./home') },
  //异步导出
  {
    path: '/batch-export/:from',
    exact: true,
    asyncComponent: () => import('./batch-export')
  },
  //订单列表
  {
    path: '/order-list',
    exact: true,
    asyncComponent: () => import('./order-list')
  },
  //订单列表(俄罗斯)
  {
    path: '/external-order-page',
    exact: true,
    asyncComponent: () => import('./external-order-page')
  },
  {
    path: '/order-list-limited',
    exact: true,
    asyncComponent: () => import('./order-list-limited')
  },
  // subscription

  {
    path: '/subscription-list',
    exact: true,
    asyncComponent: () => import('./subscription')
  },

  {
    path: '/set-banner',
    exact: true,
    asyncComponent: () => import('./set-banner')
  },
  {
    path: '/seo-setting',
    exact: true,
    asyncComponent: () => import('./seo-setting')
  },
  {
    path: '/shipping-fee-setting',
    asyncComponent: () => import('./shipping-fee-setting')
  },
  {
    path: '/site-map',
    exact: true,
    asyncComponent: () => import('./site-map')
  },
  {
    path: '/address-management',
    exact: true,
    asyncComponent: () => import('./address-management')
  },
  {
    path: '/subscription-detail/:subId',
    exact: true,
    asyncComponent: () => import('./subscription-detail')
  },
  {
    path: '/subscription-edit/:subId',
    exact: true,
    asyncComponent: () => import('./subscription-edit')
  },
  {
    path: '/subscription-plan',
    asyncComponent: () => import('./subscription-plan')
  },
  {
    path: '/subscription-plan-detail/:id',
    asyncComponent: () => import('./subscription-plan/detail')
  },
  {
    path: '/subscription-plan-update/:id',
    asyncComponent: () => import('./subscription-plan-update')
  },
  {
    path: '/subscription-plan-add',
    asyncComponent: () => import('./subscription-plan-update')
  },
  {
    path: '/subscription-benefit-setting',
    asyncComponent: () => import('./benefit-setting')
  },
  {
    path: '/subscription-benefit-setting-add',
    asyncComponent: () => import('./benefit-setting/benefit-setting-add')
  },
  // prescriber
  {
    path: '/order-list-prescriber',
    exact: true,
    asyncComponent: () => import('./order-list-prescriber')
  },
  {
    path: '/order-return-list-limited',
    exact: true,
    asyncComponent: () => import('./order-return-list-limited')
  },
  //分销记录
  {
    path: '/distribution-record',
    exact: true,
    asyncComponent: () => import('./distribution-record')
  },
  //订单-新增/编辑
  {
    path: '/order-edit/:tid',
    exact: true,
    asyncComponent: () => import('./order-add')
  },
  {
    path: '/order-add',
    exact: true,
    asyncComponent: () => import('./manual-order')
  },
  //订单-详情
  {
    path: '/order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./order-detail')
  },
  //订单-详情
  {
    path: '/order-detail-limited/:tid',
    exact: true,
    asyncComponent: () => import('./order-detail-limited')
  },
  //订单-详情prescriber
  {
    path: '/order-detail-prescriber/:tid',
    exact: true,
    asyncComponent: () => import('./order-detail-prescriber')
  },
  //订单-退单列表
  {
    path: '/order-return-list',
    exact: true,
    asyncComponent: () => import('./order-return-list')
  },
  //订单-退单列表-发起售后申请
  {
    path: '/order-return-apply-list',
    exact: true,
    asyncComponent: () => import('./order-return-apply-list')
  },
  //订单-订单管理-订单列表-新增退单
  {
    path: '/order-return-add/:id',
    exact: true,
    asyncComponent: () => import('./order-return-add')
  },
  //订单-订单管理-退单列表-修改退单
  {
    path: '/order-return-edit/:rid',
    exact: true,
    asyncComponent: () => import('./order-return-edit')
  },
  //推荐列表
  {
    path: '/recommendation',
    exact: true,
    asyncComponent: () => import('./recommendation')
  },
  //新增推荐
  {
    path: '/recommendation-add',
    exact: true,
    asyncComponent: () => import('./recommendation-add')
  },
  //编辑推荐
  {
    path: '/recommendation-edit/:id',
    exact: true,
    asyncComponent: () => import('./recommendation-add')
  },
  //订单-订单管理-推荐列表
  {
    path: '/recomm-page',
    exact: true,
    asyncComponent: () => import('./order-recommendation')
  },
  {
    path: '/recomm-page2',
    exact: true,
    asyncComponent: () => import('./order-recommendation')
  },
  //订单-订单管理-推荐列表--详情
  {
    path: '/recomm-page-detail',
    exact: true,
    asyncComponent: () => import('./order-recommendation-details')
  },
  {
    path: '/recomm-page-detail-new',
    exact: true,
    asyncComponent: () => import('./order-recommendation-details-new')
  },
  //订单-订单管理-退单详情
  {
    path: '/order-return-detail/:rid',
    exact: true,
    asyncComponent: () => import('./order-return-detail')
  },
  //财务-收款账户
  {
    path: '/finance-account-receivable',
    asyncComponent: () => import('./finance-account-receivable')
  },
  //订单收款
  {
    path: '/finance-order-receive',
    asyncComponent: () => import('./finance-order-receive')
  },
  //退单退款
  {
    path: '/finance-refund',
    asyncComponent: () => import('./finance-refund')
  },
  //收款详情
  {
    path: '/finance-receive-detail',
    asyncComponent: () => import('./finance-receive-detail')
  },
  //退款明细
  {
    path: '/finance-refund-detail',
    asyncComponent: () => import('./finance-refund-detail')
  },
  //增值税资质审核
  {
    path: '/finance-val-added-tax',
    asyncComponent: () => import('./finance-val-added-tax')
  },
  //订单开票
  {
    path: '/finance-order-ticket',
    asyncComponent: () => import('./finance-order-ticket')
  },
  //财务-开票管理
  {
    path: '/finance-ticket-manage',
    asyncComponent: () => import('./finance-ticket-manage')
  },
  // 员工列表
  {
    path: '/employee-list',
    asyncComponent: () => import('./employee-list')
  },
  // 员工导入
  {
    path: '/employee-import',
    asyncComponent: () => import('./employee-import')
  },
  // 部门管理
  {
    path: '/department-mangement',
    asyncComponent: () => import('./department-mangement')
  },
  // 部门导入
  {
    path: '/department-import',
    asyncComponent: () => import('./department-import')
  },
  // 角色列表
  {
    path: '/role-list',
    asyncComponent: () => import('./role-list')
  },
  // 权限分配
  {
    path: '/authority-allocating/:roleInfoId/:roleName',
    asyncComponent: () => import('./authority-allocating')
  },
  // 店铺分类
  { path: '/goods-cate', asyncComponent: () => import('./goods-cate') },
  // 详情模板
  {
    path: '/goods-detail-template',
    asyncComponent: () => import('./goods-detail-tab')
  },
  // 商品添加
  { path: '/goods-add', asyncComponent: () => import('./goods-add') },
  { path: '/goods-main', asyncComponent: () => import('./goods-add/main') },
  { path: '/regular-product-add', asyncComponent: () => import('./regular-product-add/main') },
  
  // goods-regular-edit > 审核通过的商品编辑
  {
    path: '/goods-regular-edit/:gid',
    asyncComponent: () => import('./regular-product-add/main')
  },
  
  // goods-bundle-edit
  {
    path: '/goods-bundle-edit/:gid',
    asyncComponent: () => import('./goods-add/main')
  },
  //Related product
  {
    path: '/related-product',
    asyncComponent: () => import('./related-product')
  },
  // 审核不通过的商品编辑
  {
    path: '/goods-check-edit/:gid',
    asyncComponent: () => import('./goods-add')
  },
  // 审核通过的商品sku编辑
  {
    path: '/goods-sku-edit/:pid',
    asyncComponent: () => import('./goods-sku-edit')
  },
  // 审核不通过的商品sku编辑
  {
    path: '/goods-sku-check-edit/:pid',
    asyncComponent: () => import('./goods-sku-edit')
  },
  // 商品详情
  {
    path: '/goods-detail/:gid',
    asyncComponent: () => import('./goods-detail')
  },
  // 商品详情SKU
  {
    path: '/goods-sku-detail/:pid',
    asyncComponent: () => import('./goods-sku-detail')
  },

  // Product list - 商品列表
  { path: '/goods-list', asyncComponent: () => import('./goods-list') },

  // 待审核商品列表
  {
    path: '/goods-check',
    asyncComponent: () => import('./goods-check')
  },
  {
    path: '/goods-inventory',
    asyncComponent: () => import('./goods-inventory')
  },

  // 客户列表
  {
    path: '/customer-list',
    asyncComponent: () => import('./customer-list')
  },
  // 客户详情
  {
    path: '/customer-details/:type/:id/:account',
    asyncComponent: () => import('./customer-details')
  },
  {
    path: '/petowner-details/:id/:account',
    asyncComponent: () => import('./customer-details/member-detail')
  },
  {
    path: '/edit-petowner/:id/:account',
    asyncComponent: () => import('./customer-details/edit-basic-information')
  },
  {
    path: '/edit-pet/:id/:account/:petid',
    asyncComponent: () => import('./customer-details/edit-pet-item')
  },
  // 客户等级
  {
    path: '/customer-level',
    asyncComponent: () => import('./customer-level')
  },
  // clinic客户列表
  {
    path: '/customer-clinic-list',
    asyncComponent: () => import('./customer-clinic-list')
  },
  // clinic客户详情
  {
    path: '/customer-clinic-details/:type/:id/:account',
    asyncComponent: () => import('./customer-clinic-details')
  },
  // 基本设置
  {
    path: '/basic-setting',
    asyncComponent: () => import('./basic-setting')
  },
  // 店铺信息
  {
    path: '/store-info',
    asyncComponent: () => import('./shop/store-info-index')
  },
  //店铺信息编辑
  {
    path: '/store-info-edit',
    asyncComponent: () => import('./shop/store-info-edit')
  },
  // 图片库
  {
    path: '/picture-store',
    asyncComponent: () => import('./picture-store')
  },
  // 视频库
  {
    path: '/video-store',
    asyncComponent: () => import('./video-store')
  },
  // 图片分类
  {
    path: '/picture-cate',
    asyncComponent: () => import('./picture-cate')
  },
  // 素材分类
  {
    path: '/resource-cate',
    asyncComponent: () => import('./resource-cate')
  },
  // 账号管理
  {
    path: '/account-manage',
    asyncComponent: () => import('./account-manage')
  },
  // 物流公司管理
  {
    path: '/logistics-manage',
    asyncComponent: () => import('./logistics-manage')
  },
  // 商品导入
  {
    path: '/goods-import',
    asyncComponent: () => import('./goods-import')
  },
  //资金管理-财务对账
  {
    path: '/finance-manage-check',
    asyncComponent: () => import('./finance-manage-check')
  },
  //资金管理-财务对账-明细
  //{ path: '/finance-manage-refund/:sid/income', asyncComponent: () => import('./finance-manage-refund') },
  //资金管理-财务结算
  {
    path: '/finance-manage-settle',
    asyncComponent: () => import('./finance-manage-settle')
  },
  //结算明细
  {
    path: '/billing-details/:settleId',
    asyncComponent: () => import('./billing-details')
  },
  //收款账户-商家收款账户
  {
    path: '/vendor-payment-account',
    asyncComponent: () => import('./vendor-payment-account')
  },
  //收款账户-商家收款账户-新增账号
  {
    path: '/vendor-new-accounts',
    asyncComponent: () => import('./vendor-new-accounts')
  },
  //开票管理-开票项目
  /* {
    path: '/finance-ticket-new',
    asyncComponent: () => import('./finance-ticket-new')
  },*/
  //Reward
  {
    path: '/finance-reward',
    asyncComponent: () => import('./finance-reward')
  },
  //Reward-detail
  {
    path: '/finance-reward-details',
    asyncComponent: () => import('./finance-reward-details')
  },
  //发布商品
  {
    path: '/release-products',
    asyncComponent: () => import('./release-products')
  },
  //资金管理-财务对账-明细
  {
    path: '/finance-manage-refund/:sid/:kind',
    asyncComponent: () => import('./finance-manage-refund')
  },
  //流量统计
  {
    path: '/flow-statistics',
    asyncComponent: () => import('./flow-statistics')
  },
  //交易统计
  {
    path: '/trade-statistics',
    asyncComponent: () => import('./trade-statistics')
  },
  //商品统计
  {
    path: '/goods-statistics',
    asyncComponent: () => import('./goods-statistics')
  },
  //客户统计
  {
    path: '/customer-statistics',
    asyncComponent: () => import('./customer-statistics')
  },
  {
    path: '/delivery-date',
    asyncComponent: () => import('./delivery-date')
  },
  //业务员统计
  {
    path: '/employee-statistics',
    asyncComponent: () => import('./employee-statistics')
  },
  //报表下载
  {
    path: '/download-report',
    asyncComponent: () => import('./download-report')
  },
  //编辑营销-满赠
  {
    path: '/marketing-full-gift/:marketingId?',
    asyncComponent: () => import('./marketing-add/full-gift')
  },
  //编辑营销-满折
  {
    path: '/marketing-full-discount/:marketingId?',
    asyncComponent: () => import('./marketing-add/full-discount')
  },
  //新增 / 编辑营销-满减
  {
    path: '/marketing-full-reduction/:marketingId?',
    asyncComponent: () => import('./marketing-add/full-reduction')
  },
  //新增 / 编辑营销-首次折扣
  {
    path: '/marketing-first-order-discount/:marketingId?',
    asyncComponent: () => import('./marketing-add/first-order-discount')
  },
  //新增 / 编辑营销-免运费
  {
    path: '/marketing-free-shipping/:marketingId?',
    asyncComponent: () => import('./marketing-add/free-shipping')
  },
  //新增 / 编辑营销-一口价
  {
    path: '/marketing-fixed-price/:marketingId?',
    asyncComponent: () => import('./marketing-add/fixed-price')
  },
  //营销列表
  {
    path: '/marketing-list',
    asyncComponent: () => import('./marketing-list')
  },
  //营销-满赠详情
  {
    path: '/marketing-details/:marketingId',
    asyncComponent: () => import('./marketing-details')
  },
  //营销中心
  {
    path: '/marketing-center',
    asyncComponent: () => import('./marketing-center')
  },
  // 商品库导入
  {
    path: '/goods-library',
    asyncComponent: () => import('./goods-library')
  },
  // 运费模板
  { path: '/freight', asyncComponent: () => import('./freight') },

  // 新增店铺运费模板
  {
    path: '/store-freight',
    asyncComponent: () => import('./freight-store')
  },
  // 编辑店铺运费模板
  {
    path: '/store-freight-edit/:freightId',
    asyncComponent: () => import('./freight-store')
  },
  // 新增单品运费模板
  {
    path: '/goods-freight',
    asyncComponent: () => import('./freight-goods')
  },
  // 编辑单品运费模板
  {
    path: '/goods-freight-edit/:freightId',
    asyncComponent: () => import('./freight-goods')
  },
  // 运费模板关联商品
  {
    path: '/freight-with-goods/:freightId',
    asyncComponent: () => import('./freight-with-goods')
  },
  //在线客服
  {
    path: '/online-service',
    asyncComponent: () => import('./online-service')
  },
  //操作日志
  {
    path: '/operation-log',
    asyncComponent: () => import('./operation-log')
  },
  // 优惠券列表
  {
    path: '/coupon-list',
    asyncComponent: () => import('./coupon-list')
  },
  // 优惠券详情
  {
    path: '/coupon-detail/:cid',
    asyncComponent: () => import('./coupon-detail')
  },
  // 营销中心 - 创建优惠券
  {
    path: '/coupon-add',
    asyncComponent: () => import('./coupon-add')
  },
  // 营销中心 - 编辑优惠券
  {
    path: '/coupon-edit/:cid',
    asyncComponent: () => import('./coupon-add')
  },
  // 优惠券活动
  {
    path: '/coupon-activity-list',
    asyncComponent: () => import('./coupon-activity-list')
  },
  // 优惠券活动详情
  {
    path: '/coupon-activity-detail/:id/:type',
    asyncComponent: () => import('./coupon-activity-detail')
  },
  // 创建/编辑全场赠券活动
  {
    path: '/coupon-activity-all-present/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/all-present')
  },
  //创建/编辑进店赠券活动
  {
    path: '/coupon-activity-store/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/store')
  },
  //创建/编辑精准发券活动
  {
    path: '/coupon-activity-specify/:activityId?',
    asyncComponent: () => import('./coupon-activity-add/specify')
  },
  //分销设置
  {
    path: '/distribution-setting',
    asyncComponent: () => import('./distribution-setting')
  },
  //分销商品
  {
    path: '/distribution-goods-list',
    asyncComponent: () => import('./distribution-goods-list')
  },
  //企业购商品
  {
    path: '/enterprise-goods-list',
    asyncComponent: () => import('./enterprise-goods-list')
  },
  //商品分销素材列表
  {
    path: '/distribution-goods-matter-list',
    asyncComponent: () => import('./distribution-goods-matter-list')
  },
  //商品评价管理
  {
    path: '/goods-evaluate-list',
    asyncComponent: () => import('./goods-evaluate-list')
  },
  //积分订单列表
  {
    path: '/points-order-list',
    exact: true,
    asyncComponent: () => import('./points-order-list')
  },
  //积分订单详情
  {
    path: '/points-order-detail/:tid',
    exact: true,
    asyncComponent: () => import('./points-order-detail')
  },
  //拼团活动列表
  {
    path: '/groupon-activity-list',
    asyncComponent: () => import('./groupon-activity-list')
  },
  // 添加拼团活动
  {
    path: '/groupon-add',
    asyncComponent: () => import('./groupon-add')
  },
  // 编辑拼团活动
  {
    path: '/groupon-edit/:activityId',
    asyncComponent: () => import('./groupon-add')
  },
  // 拼团活动详情
  {
    path: '/groupon-detail/:activityId',
    asyncComponent: () => import('./groupon-detail')
  },
  //添加秒杀商品
  {
    path: '/add-flash-sale/:activityDate/:activityTime',
    exact: true,
    asyncComponent: () => import('./flash-sale-goods-add')
  },
  //秒杀活动列表
  {
    path: '/flash-sale-list',
    exact: true,
    asyncComponent: () => import('./flash-sale')
  },
  //秒杀商品列表
  {
    path: '/flash-sale-goods-list/:activityDate/:activityTime',
    exact: true,
    asyncComponent: () => import('./flash-sale-goods-list')
  },
  //页面管理
  {
    path: '/page-manage/weixin',
    asyncComponent: () => import('./page-manage')
  },
  //模板管理
  {
    path: '/template-manage/weixin',
    asyncComponent: () => import('./template-manage')
  },
  //页面管理
  {
    path: '/page-manage/pc',
    asyncComponent: () => import('./page-manage')
  },
  //模板管理
  {
    path: '/template-manage/pc',
    asyncComponent: () => import('./template-manage')
  },
  // 企业会员列表
  {
    path: '/enterprise-customer-list',
    asyncComponent: () => import('./enterprise-customer-list')
  },
  // dictionary
  {
    path: '/dictionary',
    asyncComponent: () => import('./dictionary')
  },
  // dictionary-add
  {
    path: '/dictionary-add',
    asyncComponent: () => import('./dictionary-update')
  },
  // dictionary-edit
  {
    path: '/dictionary-edit/:id',
    asyncComponent: () => import('./dictionary-update')
  },
  // dictionary
  {
    path: '/payment-setting',
    asyncComponent: () => import('./payment-setting')
  },
  {
    path: '/payment-method',
    asyncComponent: () => import('./payment-method')
  },
  // prescriber
  {
    path: '/prescriber',
    asyncComponent: () => import('./prescriber')
  },
  //prescriber-add
  {
    path: '/prescriber-add',
    asyncComponent: () => import('./prescriber-add')
  },
  {
    path: '/prescriber-edit/:id',
    asyncComponent: () => import('./prescriber-add')
  },
  {
    path: '/prescriber-type',
    asyncComponent: () => import('./prescriber-type')
  },
  {
    path: '/prescriber-reward-rate',
    asyncComponent: () => import('./prescriber-reward-rate')
  },
  {
    path: '/prescriber-setting',
    asyncComponent: () => import('./prescriber-setting')
  },
  {
    path: '/prescriber-type-add',
    asyncComponent: () => import('./prescriber-type-add')
  },
  {
    path: '/navigation-list',
    asyncComponent: () => import('./navigation-list')
  },
  {
    path: '/navigation-update/:id',
    asyncComponent: () => import('./navigation-update')
  },
  {
    path: '/navigation-add',
    asyncComponent: () => import('./navigation-update')
  },
  //商品评价
  {
    path: '/nps-list',
    asyncComponent: () => import('./nps-list')
  },
  {
    path: '/prescriber-type-edit/:id',
    asyncComponent: () => import('./prescriber-type-add')
  },
  //message-email-list
  {
    path: '/message-email',
    asyncComponent: () => import('./message-email-list')
  },
  //message-notification
  {
    path: '/message-notification',
    asyncComponent: () => import('./message-notification')
  },
  //message-setting
  {
    path: '/message-setting',
    asyncComponent: () => import('./message-setting')
  },
  //message-overview
  {
    path: '/message-overview',
    asyncComponent: () => import('./message-overview')
  },
  //message-detail
  {
    path: '/message-quick-send',
    asyncComponent: () => import('./message-detail')
  },
  {
    path: '/message-detail/:id',
    asyncComponent: () => import('./message-detail')
  },
  {
    path: '/message-edit/:id',
    asyncComponent: () => import('./message-detail')
  },
  {
    path: '/order-setting',
    asyncComponent: () => import('./order-setting')
  },
  {
    path: '/order-audit-setting',
    asyncComponent: () => import('./order-audit-setting')
  },
  {
    path: '/report-product',
    asyncComponent: () => import('./report-product')
  },
  {
    path: '/report-transaction',
    asyncComponent: () => import('./report-transaction')
  },
  {
    path: '/report-traffic',
    asyncComponent: () => import('./report-traffic')
  },
  {
    path: '/export-report',
    asyncComponent: () => import('./export-report')
  },
  {
    path: '/sales-category',
    asyncComponent: () => import('./sales-category')
  },
  {
    path: '/product-category',
    asyncComponent: () => import('./product-category')
  },
  {
    path: '/product-finder-list',
    asyncComponent: () => import('./product-finder-list')
  },
  {
    path: '/product-sales-setting',
    asyncComponent: () => import('./product-sales-setting')
  },
  {
    path: '/product-finder-details/:id',
    asyncComponent: () => import('./product-finder-details')
  },
  {
    path: '/product-search-list',
    asyncComponent: () => import('./product-search-list')
  },
  {
    path: '/product-search-details',
    asyncComponent: () => import('./product-search-details')
  },
  {
    path: '/attribute-library',
    asyncComponent: () => import('./attribute-library')
  },
  {
    path: '/filter-sort-setting',
    asyncComponent: () => import('./filter-sort-setting')
  },
  {
    path: '/product-tagging',
    asyncComponent: () => import('./product-tagging')
  },
  {
    path: '/invoice-list',
    asyncComponent: () => import('./invoice-list')
  },
  {
    path: '/subscription-setting',
    asyncComponent: () => import('./subscription-setting')
  },
  {
    path: '/automations',
    asyncComponent: () => import('./automations')
  },
  {
    path: '/automation-workflow/:id',
    asyncComponent: () => import('./automation-workflow')
  },
  {
    path: '/pet-owner-tagging',
    asyncComponent: () => import('./pet-owner-tagging')
  },
  {
    path: '/tasks',
    asyncComponent: () => import('./task')
  },
  {
    path: '/add-task',
    asyncComponent: () => import('./task-update')
  },
  {
    path: '/edit-task/:id',
    asyncComponent: () => import('./task-update')
  },
  {
    path: '/description-management',
    asyncComponent: () => import('./description-management')
  },
  {
    path: '/pet-owner-activity/:id',
    asyncComponent: () => import('./pet-owner-activity')
  },
  {
    path: '/pet-all/:id',
    asyncComponent: () => import('./pet-all')
  },
  {
    path: '/pet-owner-all/:id',
    asyncComponent: () => import('./pet-owner-all')
  },
  {
    path: '/prescriber-booking-detail',
    asyncComponent: () => import('./prescriber-booking-detail')
  },
  {
    path: '/validation-setting',
    asyncComponent: () => import('./validation-setting')
  },
  {
    path: '/automation-detail/:id',
    asyncComponent: () => import('./automation-detail')
  },
  {
    path: '/automation-edit/:id',
    asyncComponent: () => import('./automation-form')
  },
  {
    path: '/automation-add',
    asyncComponent: () => import('./automation-form')
  },
  {
    path: '/address-field-setting',
    asyncComponent: () => import('./address-field-setting')
  },
  {
    path: '/appointment-list',
    asyncComponent: () => import('./appointment-list')
  },
  {
    path: '/appointment-add',
    asyncComponent: () => import('./appointment-list/new')
  },
  {
    path: '/appointment-update/:id',
    asyncComponent: () => import('./appointment-list/new')
  },
  {
    path: '/offline-checkout',
    asyncComponent: () => import('./offline-checkout')
  },
  {
    path: '/split-order-setting',
    asyncComponent: () => import('./order-split-setting')
  }
];

const homeRoutes = [
  { path: '/login', asyncComponent: () => import('./login') },

  { path: '/login-admin', asyncComponent: () => import('./login-admin') },
  { path: '/login-test', asyncComponent: () => import('./login-admin') },
  { path: '/403', asyncComponent: () => import('./403') },
  { path: '/logout', asyncComponent: () => import('./logout') },
  { path: '/login-verify', asyncComponent: () => import('./login-verify') },
  { path: '/login-notify', asyncComponent: () => import('./login-notify') },
  { path: '/implicit/callback', component: LoginCallback },
  {
    path: '/find-password',
    asyncComponent: () => import('./find-password')
  },
  {
    path: '/lackcompetence',
    asyncComponent: () => import('./lackcompetence')
  },
  {
    path: '/pay-help-doc',
    asyncComponent: () => import('./pay-help-doc')
  },
  // 运费模板计算公式说明
  {
    path: '/freight-instruction',
    asyncComponent: () => import('./freight-instruction')
  },
  //视频详情
  {
    path: '/video-detail',
    asyncComponent: () => import('./video-detail')
  },
  //商家注册
  {
    path: '/company-register',
    asyncComponent: () => import('./company-register')
  },
  //商家注册协议
  {
    path: '/supplier-agreement',
    asyncComponent: () => import('./company-register/component/agreement')
  },
  {
    path: '/generalTermsAndConditions',
    asyncComponent: () => import('./general-terms-and-conditions')
  },
  { path: '/error', asyncComponent: () => import('./error') }
  //{ path: '*', asyncComponent: () => import('./error') }
];

// 审核未通过下的, 包括未开店
const auditDidNotPass = [
  //开店流程
  {
    path: '/shop-process',
    asyncComponent: () => import('./shop/process-index')
  }
];

export { routes, homeRoutes, auditDidNotPass };
