import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

export function getPetOwner(id) {
  return Fetch<TResult>('/customer/detail2/' + id, {
    method: 'GET'
  });
}

export function getPetList(filterParams = {}) {
  return Fetch<TResult>('/customerpets/getListByCustomerAccount', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getPetOwnerTasks(filterParams = {}) {
  return Fetch<TResult>('/customer/tasks/list', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getGlodenMomentList() {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      type: 'GoldenMoment'
    })
  });
}

export function getOrderList(filterParams = {}) {
  return Fetch<TResult>('/trade', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getSubscriptionList(filterParams = {}) {
  return Fetch<TResult>('/sub/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getEamils(filterParams = {}, isRecent) {
  if (isRecent) {
    return Fetch<TResult>('/biz/contactActivity/listRecentEmails', {
      method: 'POST',
      body: JSON.stringify({
        ...filterParams
      })
    });
  } else {
    return Fetch<TResult>('/biz/contactActivity/listAllEmails', {
      method: 'POST',
      body: JSON.stringify({
        ...filterParams
      })
    });
  }
}

export function getActivities(filterParams = {}, isRecent) {
  if (isRecent) {
    return Fetch<TResult>('/biz/contactActivity/listRecent', {
      method: 'POST',
      body: JSON.stringify({
        ...filterParams
      })
    });
  } else {
    return Fetch<TResult>('/biz/contactActivity/listAll', {
      method: 'POST',
      body: JSON.stringify({
        ...filterParams
      })
    });
  }
}

export function addComment(filterParams = {}) {
  return Fetch<TResult>('/customer/note/addOrEdit', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
