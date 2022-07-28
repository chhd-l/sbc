import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getPrescriberByPrescriberIdAndStoreId(filterParams = {}) {
  return Fetch<TResult>('/prescriber/getPrescriberByPrescriberIdAndStoreId', {
    method: 'POST',
    body: JSON.stringify({ ...filterParams })
  });
}

export function getStoreOpenConsentList(filterParams = {}) {
  return Fetch<TResult>('/consent/getStoreOpenConsentList', {
    method: 'POST',
    body: JSON.stringify({ ...filterParams })
  });
}

export function verifyUser(filterParams = {}) {
  return Fetch<TResult>('/prescriber/verifyUser', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function findPrescriberIdAndStoreBy(filterParams = {}) {
  return Fetch<TResult>('/prescriber/findAccountAndStore', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function saveConsent(filterParams = {}) {
  return Fetch<TResult>('/prescriber/saveConsent', {
    method: 'POST',
    body: JSON.stringify({ ...filterParams })
  });
}
