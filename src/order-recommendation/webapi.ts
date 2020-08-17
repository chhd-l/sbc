import { Fetch } from 'qmkit';

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询订单是否需要审核
 */
export const getOrderNeedAudit = () => {
  return Fetch<TResult>('/getSupplierOrderAudit');
};

/**
 * 批量审核
 * @param ids
 * @returns {Promise<IAsyncResult<T>>}
 */
export const batchAudit = (ids) => {
  return Fetch<TResult>('/trade/audit', {
    method: 'POST',
    body: JSON.stringify({
      ids
    })
  });
};

/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const audit = (tid: string, audit: string, reason: string) => {
  return Fetch<TResult>(`/trade/audit/${tid}`, {
    method: 'POST',
    body: JSON.stringify({
      auditState: audit,
      reason: reason
    })
  });
};

/**
 * 回审
 */
export const retrial = (tid: string) => {
  return Fetch<TResult>(`/trade/retrial/${tid}`);
};

export const confirm = (tid: string) => {
  return Fetch<TResult>(`/trade/confirm/${tid}`);
};

/**
 * 验证订单是否存在售后申请
 * @param tid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliverVerify = (tid: string) => {
  return Fetch<TResult>(`/trade/deliver/verify/${tid}`);
};

/**
 * 验证购买人
 * @param buyerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyBuyer = (buyerId: string) => {
  return Fetch(`/customer/customerDelFlag/${buyerId}`);
};

/*---------------------------- 详情  ------------------------------------------------*/

/**
 * 查询商家店铺品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchBrandList = () => {
  return Fetch<TResult>('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询商家店铺全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCateList = () => {
  return Fetch<TResult>('/contract/goods/cate/list', {
    method: 'GET'
  });
};

/**
 * 查询商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGoodsList = (params) => {
  return Fetch('/goods/skus', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 获取店铺客户等级列表
 */
export const getUserLevelList = () => {
  return Fetch<TResult>('/store/storeLevel/list', {
    method: 'GET'
  });
};

/**
 * 判断sku是否已经存在于其他同类型的营销活动中
 * @returns {Promise<IAsyncResult<T>>}
 */
export const skuExists = (params) => {
  return Fetch<TResult>('/marketing/sku/exists', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 获取详情
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getMarketingInfo = (marketingId) => {
  return Fetch<TResult>(`/marketing/${marketingId}`, {
    method: 'GET'
  });
};

/*获取市区*/
export const timeZone = () => {
  return Fetch('/timeZone/convert', {
    method: 'POST'
  });
};
