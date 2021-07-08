import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
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
