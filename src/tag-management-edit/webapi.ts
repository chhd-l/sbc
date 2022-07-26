import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

//new

// 新增tag
export function addTag(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 编辑tag
export function editTag(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment', {
    method: 'PUT',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 查询tag详情
export function getTagDetail(id) {
  return Fetch<TResult>(`/customer/segment/segment/${id}`, {
    method: 'GET'
  });
}
