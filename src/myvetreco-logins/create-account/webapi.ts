import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function createStoreAccount(filterParams) {
  return Fetch<TResult>('/store/create/account', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function createStoreAccountCheck(params) {
  return Fetch<TResult>('/store/create/account/check', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
export function accountCreate(params) {
  return Fetch<TResult>('/store/create/account/create', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
