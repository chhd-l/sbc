import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * 获取Payment Setting
 * @returns {Promise<IAsyncResult<TResult>>}
 */

export const queryByStoreId = () => {
  return Fetch<TResult>('/storePayment/queryByStoreId', {
    method: 'GET'
  });
};

export const addStorePayment = (rids) => {
  return Fetch<TResult>('/storePayment/addStorePayment', {
    method: 'POST',
    body: JSON.stringify(rids)
  });
};

export const editStorePayment = (rids) => {
  return Fetch<TResult>('/storePayment/editStorePayment', {
    method: 'PUT',
    body: JSON.stringify(rids)
  });
};

/**
 * 保存Payment Setting
 * @param info
 */
export const savePaymentSetting = (info) => {
  return Fetch<TResult>('/store/storePaymentSetting', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};
