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
export function getSubscription(id: String) {
  return Fetch<TResult>('/sub/getSubscription/' + id, {
    method: 'POST'
  });
}

// 根据ID查找字典信息
export function querySysDictionaryById(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionaryById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 更新Subscription
export function updateSubscription(filterParams = {}) {
  return Fetch<TResult>('/sub/updateSubscription', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * 分type查询该客户的所有收货地址
 * @param filterParams
 */
export function getAddressListByType(id = null, type = '') {
  return Fetch<TResult>('/customer/addressList/listByCustomerIdAndType?customerId=' + id + '&type=' + type, {
    method: 'Get'
  });
}
// 根据订阅单号查找日志信息
export function getBySubscribeId(filterParams = {}) {
  return Fetch<TResult>('/sub/getBySubscribeId', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 根据参数查询促销的金额与订单运费
export function getPromotionPrice(filterParams = {}) {
  return Fetch<TResult>('/sub/getPromotionPrice', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function cancelNextSubscription(filterParams = {}) {
  return Fetch<TResult>('/sub/cancelNextSubscription', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateNextDeliveryTime(filterParams = {}) {
  return Fetch<TResult>('/sub/updateNextDeliveryTime', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function queryCityById(filterParams = {}) {
  return Fetch<TResult>('/system-city/query-system-city-by-id', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
