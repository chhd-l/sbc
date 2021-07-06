import { Fetch } from 'qmkit';

export const fetchCouponInfo = (couponId: string) => {
  return Fetch<TResult>(`/coupon-info/${couponId}`);
};
/**
 * Category
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGoodsCate = () => {
  return Fetch('/store_cate/batch/cate');
};


/*获取Attribute*/
export const getAllAttribute = (params) => {
  return Fetch('/attribute_library/attributes', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};