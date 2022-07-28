import { Fetch, Const } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getUOMCategoryList(params: any = {}) {
  return Fetch<TResult>('/uomCategory/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function addUOMCategory(params: any = {}) {
  return Fetch<TResult>('/uomCategory/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
} 

export function editUOMCategory(params: any = {}) {
  return Fetch<TResult>('/uomCategory/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

export function delUOMCategory(id: string) {
  return Fetch<TResult>(`/uomCategory/delete/${id}`, {
    method: 'DELETE'
  });
}