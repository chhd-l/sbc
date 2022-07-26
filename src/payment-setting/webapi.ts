import { Fetch } from 'qmkit';

import {TResult} from 'qmkit/type';

/**
 * 获取Payment Setting
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getPaymentSetting() {
  return Fetch<TResult>('/pay/psp/listPayPspAndItemAndConfig');
}
/**
 * 保存Payment Setting
 * @param info
 */
export const savePaymentSetting = (info) => {
  return Fetch<TResult>('/pay/psp/savePayPspAndStorePspConfig', {
    method: 'POST',
    body: JSON.stringify(info)
  });
};
