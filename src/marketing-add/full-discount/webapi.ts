import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

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
 * Category
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGoodsCate = () => {
  return Fetch('/store_cate/batch/cate');
};
