import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

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
 * Category
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGoodsCate = () => {
  return Fetch('/store_cate/batch/cate');
};
