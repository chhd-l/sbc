import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

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

export function addNavigation(filterParams = {}) {
  return Fetch<TResult>('/navigations', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateNavigation(filterParams) {
  return Fetch<TResult>('/navigations/' + filterParams.id, {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get list
 * @param filterParams
 */
export function deleteNavigations(filterParams = {}) {
  return Fetch<TResult>('/navigations/fields', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function sortNavigations(sortList) {
  return Fetch<TResult>('/navigations', {
    method: 'PUT',
    body: JSON.stringify(sortList)
  });
}

export const getStoreInfo = () => {
  return Fetch<TResult>('/store/storeInfo');
};
