import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取Payment Setting
 * @returns {Promise<IAsyncResult<TResult>>}
 */

export const queryByStoreId = (rids) => {
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
    method: 'POST',
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
