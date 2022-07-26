import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';

/**
 * 添加卡
 * @param store_id  店铺id
 * @param params 添加卡数据
 * @returns 
 */
export function fetchAddPaymentInfo(store_id,params = {}) {
  return Fetch<TResult>(`/${store_id}/pay-payment-info`, {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 查询银行卡类型
 * @param store_id 店铺id
 * @returns 
 */
export function fetchGetPayPspList(store_id) {
  return Fetch<TResult>(`/${store_id}/pay/getPayPspList`);
}


/**
 * 删除银行卡信息
 * @param store_id 
 * @param id
 * @returns {Promise<IAsyncResult<T>>}
 */
export function deletePaymentsInfoByIds(store_id:string,id:string) {
  return Fetch<TResult>(`/${store_id}/pay-payment-info/${id}`, {
    method: 'DELETE'
  });
}

export function getOriginClientKeys() {
  return Fetch<TResult>(`/payment-method/origin-client-keys`, {
    method: 'get'
  });
}



