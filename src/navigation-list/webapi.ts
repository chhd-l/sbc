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
  return Fetch<TResult>('/navigation/' + id + '/' + status, {
    method: 'PUT'
  });
}

export const getStoreInfo = () => {
  return Fetch<TResult>('/store/storeInfo');
};
