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
 * 新增批量翻译
 * @param filterParams
 */
export function translateAddBatch(filterParams = {}) {
  return Fetch<TResult>('/goods/translate/translate/addBatch', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 新增批量翻译
 * @param filterParams
 */
export function defaultProductSetting(filterParams = {}) {
  return Fetch<TResult>('/goods/translate/defaultProductSetting', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * 新增字典
 * @param filterParams
 */
export function addSysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/addSysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 删除字典
 * @param filterParams
 */
 export function delSysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdict/delSysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
