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
  return Fetch<TResult>('/store/storePaymentSetting');
}
