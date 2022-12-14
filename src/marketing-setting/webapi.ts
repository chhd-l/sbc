import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';
export const fetchCouponInfo = (couponId: string) => {
  return Fetch<TResult>(`/coupon-info/${couponId}`);
};
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

/*获取Group*/
export const getAllGroups = (params) => {
  return Fetch('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/*获取Attribute*/
export const getAllAttribute = (params) => {
  return Fetch('/attribute_library/attributes', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 新增满减
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFullReduction = (reductionBean) => {
  return Fetch<TResult>('/marketing/fullReduction', {
    method: 'POST',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * 编辑满减
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullReduction = (reductionBean) => {
  return Fetch<TResult>('/marketing/fullReduction', {
    method: 'PUT',
    body: JSON.stringify(reductionBean)
  });
};

/**
 * Category
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGoodsCate = () => {
  return Fetch('/store_cate/batch/cate');
};

/**
 * 新增满折
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFreeShipping = (shippingBean) => {
  return Fetch<TResult>('/marketing/freeShipping', {
    method: 'POST',
    body: JSON.stringify(shippingBean)
  });
};

/**
 * 编辑满折
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFreeShipping = (shippingBean) => {
  return Fetch<TResult>('/marketing/freeShipping', {
    method: 'PUT',
    body: JSON.stringify(shippingBean)
  });
};


/**
 * 新增优惠券
 * @param params
 */
export const addCoupon = (params) => {
  return Fetch('/coupon-info', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改优惠券
 * @param params
 */
export const editCoupon = (params) => {
  return Fetch('/coupon-info', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 新增满折
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFullDiscount = (discountBean) => {
  return Fetch<TResult>('/marketing/fullDiscount', {
    method: 'POST',
    body: JSON.stringify(discountBean)
  });
};

/**
 * 编辑满折
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullDiscount = (discountBean) => {
  return Fetch<TResult>('/marketing/fullDiscount', {
    method: 'PUT',
    body: JSON.stringify(discountBean)
  });
};

/**
 * 新增满赠
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFullGift = (giftBean) => {
  return Fetch<TResult>('/marketing/fullGift', {
    method: 'POST',
    body: JSON.stringify(giftBean)
  });
};

/**
 * 编辑满赠
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullGift = (giftBean) => {
  return Fetch<TResult>('/marketing/fullGift', {
    method: 'PUT',
    body: JSON.stringify(giftBean)
  });
};

/**
 * 新增leaflet
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFullLeaflet = (leafletBean) => {
  return Fetch<TResult>('/marketing/fullLeaflet', {
    method: 'POST',
    body: JSON.stringify(leafletBean)
  });
};

/**
 * 编辑leaflet
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullLeaflet = (leafletBean) => {
  return Fetch<TResult>('/marketing/fullLeaflet', {
    method: 'PUT',
    body: JSON.stringify(leafletBean)
  });
};

/**
 * 删除优惠券
 */
export function deleteCoupon(id) {
  return Fetch<TResult>(`/coupon-info/${id}`, { method: 'DELETE' });
}
/**
 * 删除营销
 * @param marketingId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deleteMarketing = (marketingId) => {
  return Fetch<TResult>(`/marketing/delete/${marketingId}`, {
    method: 'DELETE'
  });
};