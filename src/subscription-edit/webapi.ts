import { Fetch, Const } from 'qmkit';

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

/**
 * retrySubscription
 * @param filterParams
 */
 export function retrySubscription(id: String) {
  return Fetch<TResult>('/retry/retrySubscription' + id, {
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
  return Fetch<TResult>(
    '/customer/addressList/listByCustomerIdAndType?customerId=' + id + '&type=' + type,
    {
      method: 'Get'
    }
  );
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

/**
 *
 * @returns 获取地址输入类型
 */
export async function getAddressInputTypeSetting() {
  return await Fetch<TResult>('/system/config/listSystemConfigByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      configType: 'address_input_type'
    })
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE && data.res.context && data.res.context.length > 0) {
        return data.res.context.findIndex(
          (ad) => ad.configKey === 'address_input_type_manually' && ad.context === '1'
        ) > -1
          ? 'MANUALLY'
          : 'AUTOMATICALLY';
      } else {
        return '';
      }
    })
    .catch(() => {
      return '';
    });
}

/**
 * 搜索地址 Dadata
 * @param txt
 * @returns
 */
async function getAddressListByDadata(txt: string) {
  return Fetch<TResult>(`/address-input-auto/list?keyword=${txt}`, {
    method: 'GET'
  })
    .then((data) => {
      if (data.res.code === Const.SUCCESS_CODE && data.res.context.addressList.length > 0) {
        return data.res.context.addressList[0];
      } else {
        return {};
      }
    })
    .catch(() => {
      return {};
    });
}

export async function calcShippingFee(address: string) {
  const addressObj = await getAddressListByDadata(address);
  return await Fetch<TResult>('/ShipSetting/Calculation', {
    method: 'POST',
    body: JSON.stringify({
      sourceRegionFias: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
      sourceAreaFias: null,
      sourceCityFias: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
      sourceSettlementFias: null,
      sourcePostalCode: null,
      regionFias: addressObj.provinceId || null,
      areaFias: addressObj.areaId || null,
      cityFias: addressObj.cityId || null,
      settlementFias: addressObj.settlementId || null,
      postalCode: addressObj.postCode || null,
      weight: '1',
      insuranceSum: 0,
      codSum: 0,
      dimensions: {
        height: '1',
        width: '1',
        depth: '1'
      }
    })
  })
    .then((data) => data)
    .catch(() => ({ res: { code: '505' } }));
}

export function getCards(customerId) {
  return Fetch<TResult>('/pay-payment-info/' + customerId, {
    method: 'Get'
  });
}

export function deleteCard(storeId, paymentId) {
  return Fetch<TResult>(
    '/' + storeId + '/pay-payment-info-del/' + paymentId,
    {
      method: 'DELETE'
    },
    { isHandleResult: true, customerTip: true }
  );
}

export function getTimeSlot(filterParams = {}) {
  return Fetch<TResult>('/delivery/timeSlot-supplier', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 获取pick point状态
export function getPickupPointStatus(id: String) {
  return Fetch<TResult>('/sub/getPPoinState/' + id, {
    method: 'POST'
  });
}

// 获取pick point状态
export function checkSubscriptionAddressPickPoint(filterParams = {}) {
  return Fetch<TResult>('/sub/checkSubscriptionAddressPickPoint', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 更新订阅的sku
export function changeSubscriptionGoods(params = {}) {
  return Fetch<TResult>('/sub/changeSubscriptionGoods', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 删除订阅商品
 */
export function deleteProduct(params = {}) {
  return Fetch<TResult>('/sub/deleteSubscriptionGoods', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * refill添加商品
 */
 export function refillAddProduct(params = {}) {
  return Fetch<TResult>('/subscription/next/refill', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * refill删除商品
 */
 export function refilldelProduct(params = {}) {
  return Fetch<TResult>('/subscription/next/refill', {
    method: 'DELETE',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * refill修改商品
 */
export function refillModifyProduct(params = {}) {
  return Fetch<TResult>('/subscription/next/refill', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * refill查询商品
 */
 export function refillgetProduct(subscribeId) {
  return Fetch<TResult>(`/subscription/next/refill/${subscribeId}`, {
    method: 'GET'
  });
}

/**
 * refill查询商品折扣
 */
 export function getrefillcode() {
  return Fetch<TResult>(`/subscription/next/refill/code`, {
    method: 'GET'
  });
}
