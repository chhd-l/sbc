import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';


export function getBlockList(params = {}) {
  return Fetch<TResult>('/customer/filter/query', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

export function getEnums() {
  return Fetch<TResult>('/customer/filter/enumTimeType', {
    method: 'GET',
  });
}

export function addBlockEmail(params = {}) {
  return Fetch<TResult>('/customer/filter', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  }, {
    isHandleResult: true,
    customerTip: true
  });
}

export function updateBlockMessage(params = {}) {
  return Fetch<TResult>('/customer/filter', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}

export function deleteBlock(params = {}) {
  return Fetch<TResult>('/customer/filter', {
    method: 'DELETE',
    body: JSON.stringify({
      ...params
    })
  });
}
