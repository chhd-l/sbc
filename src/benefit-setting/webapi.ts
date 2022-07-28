/*获取Group*/
import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';


export const getAllGroups = (params) => {
  return Fetch('/customer/segment/segment/query', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 新增满赠
 * @returns {Promise<IAsyncResult<T>>}
 */
export const addFullGift = (giftBean) => {
  return Fetch<TResult>('/marketing/fullGift', {
    method: 'POST',
    body: JSON.stringify(giftBean)
  });
};

/**
 * 编辑满赠
 * @returns {Promise<IAsyncResult<T>>}
 */
export const updateFullGift = (giftBean) => {
  return Fetch<TResult>('/marketing/fullGift', {
    method: 'PUT',
    body: JSON.stringify(giftBean)
  });
};

/**
 * 生成随机数，作为key值
 * @returns {string}
 */
export const makeRandom = () => {
  return 'key' + (Math.rdmValue() as any).toFixed(6) * 1000000;
};

/**
 * 获取详情
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getMarketingInfo = (marketingId) => {
  return Fetch<TResult>(`/marketing/${marketingId}`, {
    method: 'GET'
  });
};

/**
 * 获取 Gift_quarter_type 数据
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getGiftQuarterTypeList() {
  return Fetch<TResult>('/sysdict/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      type: 'Gift_quarter_type'
    })
  });
}

/**
 * 获取 fullGift/getState数据
 * @returns {Promise<IAsyncResult<T>>}
 */
export function getfullGiftState(marketingId) {
  return Fetch<TResult>(
    `/marketing/fullGift/getState/${marketingId}`,
    {
      method: 'GET'
    },
    { isHandleResult: true, customerTip: true }
  );
}
