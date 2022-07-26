import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

/**
 * 查询商家店铺全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCateList = () => {
  return Fetch<TResult>('/storeCate', {
    method: 'GET'
  });
};

/**
 * 查询商品列表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchGoodsList = (params) => {
  return Fetch('/goods/distribution-sku', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};
