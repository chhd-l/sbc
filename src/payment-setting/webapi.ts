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
