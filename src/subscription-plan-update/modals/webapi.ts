import { Fetch, cache } from 'qmkit';

import {TResult} from 'qmkit/type';

export const getBrandList = () => {
  return Fetch<TResult>('/contract/goods/brand/list');
};

export const getProductCategoryList = () => {
  return Fetch<TResult>('/contract/goods/cate/list');
};

export function getSkuProducts(param) {
  return Fetch<TResult>('/goodsInfos/bundelPage', {
    method: 'POST',
    body: JSON.stringify({ ...param, storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId })
  });
}

export function getConsents(param = {}) {
  return Fetch<TResult>('/consent/list', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
