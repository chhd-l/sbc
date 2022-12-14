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

/**
 * get list
 * @param filterParams
 */
export function getNavigations(language) {
  return Fetch<TResult>('/navigations' + (language ? '?language=' + language : ''), {
    method: 'GET'
  });
}

/**
 * get list
 * @param filterParams
 */
export function deleteNavigation(id) {
  return Fetch<TResult>('/navigation/' + id, {
    method: 'DELETE'
  });
}

export function sortNavigations(sortList) {
  return Fetch<TResult>('/navigations', {
    method: 'PUT',
    body: JSON.stringify(sortList)
  });
}

export function updateNavigationStatus(id, status) {
  return Fetch<TResult>('/navigation/' + id + '/status?' + 'enable=' + status, {
    method: 'PUT'
  });
}

export const getStoreInfo = () => {
  return Fetch<TResult>('/store/storeInfo');
};

/**
 * navigation header & footer
 */
export function getStoreHeader() {
  return Fetch<TResult>('/storeConfig//queryStoreConfig/headerFooterConfig');
}

export function saveStoreHeader(params = {}) {
  return Fetch<TResult>('/storeConfig/saveNavigation', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getConfigContext(params) {
  return Fetch<TResult>('/storeConfig/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function saveCookieBanner(params = {}) {
  return Fetch<TResult>('/storeConfig/banner/update', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function getShopConfig() {
  return Fetch<TResult>('/storeConfig/findShopConfig');
}

export function saveShopConfig(params = {}) {
  return Fetch<TResult>('/storeConfig/editShopConfig', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}