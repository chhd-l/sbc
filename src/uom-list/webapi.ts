import { Fetch, Const } from 'qmkit';

import {TResult} from 'qmkit/type';

export const UOM_TYPE_LIST = [
  {
    name: 'Reference UOM for this category',
    value: 'Reference UOM for this category',
  },
  {
    name: 'Bigger than the reference UOM',
    value: 'Bigger than the reference UOM',
  },
  {
    name: 'Smaller than the reference UOM',
    value: 'Smaller than the reference UOM',
  }
];

export function getAllUOMCategory() {
  return Fetch<TResult>('/uomCategory/page', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 9999
    })
  });
}

export function getUOMList(params: any = {}) {
  return Fetch<TResult>('/uom/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function addUom(params: any = {}) {
  return Fetch<TResult>('/uom/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export function editUom(params: any = {}) {
  return Fetch<TResult>('/uom/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

export function delUom(id: string) {
  return Fetch<TResult>(`/uom/delete/${id}`, {
    method: 'DELETE'
  });
}