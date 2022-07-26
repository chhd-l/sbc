import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

/**
 * 获取Dictionary列表
 * @param filterParams
 */
export function fetchDictionaryList(filterParams = {}) {
  return Fetch<TResult>('/sysdict/pageView', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * Get Dictionary Type
 * @param filterParams
 */
export function getDictionaryTypes(filterParams = {}) {
  return Fetch<TResult>('/sysdict/queryTypeList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * delete Dictionary
 * @param filterParams
 */
export function deleteDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/delSysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
