import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getAuditConfig() {
  return Fetch<TResult>('/order/config/listSystemConfig', {
    method: 'GET'
  });
}

export function saveAuditConfig(filterParams = {}) {
  return Fetch<TResult>('/order/config/batchEnableAndDisable', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getGoodsCategory() {
  return Fetch<TResult>('/goods/cate/listGoodsCateByStoreId', {
    method: 'GET'
  });
}

export function updateCategoryStatus(filterParams = {}) {
  return Fetch<TResult>('/goods/cate/enableAndDisable', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function updateCategoryPrescriber(filterParams = {}) {
  return Fetch<TResult>('/goods/cate/prescriberEnableAndDisable', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

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
