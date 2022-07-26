import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * get Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getOrderSettingConfig() {
  return Fetch<TResult>('/orderConfig/query', {
    method: 'GET'
  });
}
export function getQueryOrderSequence(storeId) {
  return Fetch<TResult>(`/orderConfig/queryOrderSequence?storeId=${storeId}`, {
    method: 'GET'
  });
}

export function updateOrderSettingConfig(filterParams = {}) {
  return Fetch<TResult>('/orderConfig', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
