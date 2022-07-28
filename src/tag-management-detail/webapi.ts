import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

//new

export function addPetOwnerBindTag(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment/segmentCustomerRel', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getBindPetOwner(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment/customer', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
export function getNotBindPetOwner(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment/customerExceptBindSegmentId', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function deletePetOwnerBindTag(filterParams = {}) {
  return Fetch<TResult>('/customer/segment/segment/segmentCustomerRel', {
    method: 'DELETE',
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
