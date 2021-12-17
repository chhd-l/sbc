import { Fetch, Const, cache } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

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

export function getOrderSettingConfig() {
  return Fetch<TResult>('/orderConfig/query', {
    method: 'GET'
  });
}

export function getQueryOrderSequence() {
  const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] ?? 0;
  return Fetch<TResult>(`/orderConfig/queryOrderSequence?storeId=${storeId}`, {
    method: 'GET'
  });
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

export function updateOrderSettingConfig(filterParams = {}) {
  return Fetch<TResult>('/orderConfig', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}