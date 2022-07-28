import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

//new

// 分页获取 tagging list
export function getTagging(filterParams = {}) {
  return Fetch<TResult>('/goods_tagging/taggings', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 新增 tagging
export function addTagging(filterParams = {}) {
  return Fetch<TResult>('/goods_tagging/tagging', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 修改 tagging
export function updateTagging(filterParams = {}) {
  return Fetch<TResult>('/goods_tagging/tagging', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 删除 tagging
export function deleteTagging(filterParams = {}) {
  return Fetch<TResult>('/goods_tagging/tagging', {
    method: 'DELETE',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get City
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
