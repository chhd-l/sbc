import { Fetch, Const } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/* --------- consent  ----------*/

//consentList
export function fetchConsentList(param = {}) {
  return Fetch<TResult>('/consent/list', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

//排序
export function fetchPropSort(param = {}) {
  return Fetch<TResult>('/consent/exchangeSort', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

//删除
export const fetchConsentDelete = (params) => {
  return Fetch<TResult>(`/consent/${params}`, {
    method: 'DELETE'
  });
};

//语言字典
export function fetchQuerySysDictionary(param = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

//new consent
export function fetchNewConsent(param = {}) {
  return Fetch<TResult>('/consent/add', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

//switch
export function fetchSwitch(param = {}) {
  return Fetch<TResult>('/consent/switch', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

//edit-list
export function fetchEditList(param) {
  return Fetch<TResult>(`/consent/${param}`, {
    method: 'GET'
  });
}

//edit-save
export function fetchEditSave(param = {}) {
  return Fetch<TResult>('/consent/edit', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
}

//edit-Detail-Delete
export const fetchConsentDetailDelete = (params) => {
  return Fetch<TResult>(`/consent/detail/${params}`, {
    method: 'DELETE'
  });
};
