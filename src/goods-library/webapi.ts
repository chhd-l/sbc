import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * 商品库列表
 * @param params
 */
const goodsList = params => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/standard/spus', request);
};

/**
 * 查询全部签约的品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
const getBrandList = () => {
  return Fetch('/contract/goods/brand/list', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () => {
  return Fetch('/contract/goods/cate/list', {
    method: 'GET'
  });
};

const importToGoodsLibrary = params => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch<TResult>('/standard/goods', request);
};

export { goodsList, getBrandList, getCateList, importToGoodsLibrary };
