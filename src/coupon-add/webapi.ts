import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';


/**
 * 查询优惠券分类列表
 */
export const fetchCouponCate = () => {
  return Fetch('/coupon-cate/list');
};

/**
 * 查询店铺签约的品牌
 */
export const fetchBrands = () => {
  return Fetch<TResult>('/contract/goods/brand/list');
};

/**
 * 查询店铺分类
 */
export const fetchCates = () => {
  return Fetch<TResult>('/storeCate');
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
 * 查询优惠券信息
 * @param couponId 优惠券Id
 */
export const fetchCoupon = (couponId) => {
  return Fetch(`/coupon-info/${couponId}`);
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
 * 查询商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const goodsList = (params) => {
  return Fetch<TResult>('/goods/skus', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * Category
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGoodsCate = () => {
  return Fetch('/store_cate/batch/cate');
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
/*获取市区*/
export const timeZone = () => {
  return Fetch('/timeZone/convert', {
    method: 'POST'
  });
};
