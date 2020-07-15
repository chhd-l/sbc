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

// 根据ID查找宠物信息
export function petsById(filterParams = {}) {
  return Fetch<TResult>('/pets/petsById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 根据ID查找Address信息
export function addressById(id: String) {
  return Fetch<TResult>('/customer/addressList/id/' + id, {
    method: 'GET'
  });
}

/**
 * get Details
 * @param filterParams
 */
export function getSubscriptionDetail(id: String) {
  return Fetch<TResult>('/sub/getSubscriptionDetail/' + id, {
    method: 'POST'
  });
}
