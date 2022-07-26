import { Fetch, Const, cache } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getStoreInfo() {
  return Fetch<TResult>('/store/storeInfo', {
    method: 'GET'
  });
}

export function getDictionaryByType(dictionaryType: String) {
  let params = {
    type: dictionaryType
  };
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify(params)
  }).then(data => {
    if (data.res.code === Const.SUCCESS_CODE) {
      return data.res.context?.sysDictionaryVOS ?? [];
    } else {
      return [];
    }
  }).catch(() => { return []; });
}

export const getCateList = () => {
  return Fetch<TResult>('/contract/cate/list', {
    method: 'GET'
  });
};

export const getBrandList = () => {
  return Fetch<TResult>('/contract/brand/list', {
    method: 'GET'
  });
};

export const editStoreInfo = (info) => {
  return Fetch<TResult>('/store/storeInfo', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

