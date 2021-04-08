import { Fetch, cache } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取线下售卖产品列表
 * @returns 
 */
export function getProductList() {
  return Fetch<TResult>('/felinReco/products', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * 扫描二维码显示member的推荐产品
 * @param apptNo 
 * @returns 
 */
export function findAppointmentByAppointmentNo(apptNo: string) {
  return Fetch<TResult>('/appt/findByNo', {
    method: 'POST',
    body: JSON.stringify({ apptNo })
  });
}

/**
 * 发起下单和支付
 * @param params 
 * @returns 
 */
export function checkout(params = {}) {
  const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || '';
  return Fetch<TResult>(`/${storeId}/all/pos/checkout`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 异步查询支付状态
 * @param params 
 * @returns 
 */
export function queryStatus(params = {}) {
  return Fetch<TResult>('/all/order/queryPosOrder', {
    method: 'POST',
    body: JSON.stringify(params)
  }, { isHandleResult: true, customerTip: true });
}

/**
 * 设置订单复购意向参数
 * @param tid 订单号
 * @param repeat 是否同意复购
 * @returns 
 */
export function refillOrder(tid: string, repeat: true | false) {
  return Fetch<TResult>('/all/order/repeat', {
    method: 'POST',
    body: JSON.stringify({
      tid,
      repeat
    })
  });
}
