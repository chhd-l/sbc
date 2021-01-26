import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export const getBrandList = () => {
    return Fetch<TResult>('/contract/goods/brand/list');
};

export const getProductCategoryList = () => {
    return Fetch<TResult>('/contract/goods/cate/list');
};

export function getSkuProducts(param) {
    return Fetch<TResult>('/goodsInfos/bundelPage', {
      method: 'POST',
      body: JSON.stringify(param)
    });
}


export function getConsents(param = {}) {
  return Fetch<TResult>('/consent/list', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}