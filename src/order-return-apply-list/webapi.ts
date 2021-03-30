import { Fetch } from 'qmkit';


type TResult = {
  code: string;
  message: string;
  context: any;
};

export const fetchOrderList = (filter = {}) => {
  // return Fetch<TResult>('/trade/list/return', {
  return Fetch<TResult>('http://192.168.0.139/trade/list/return', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

/**
 * 获取订单详情
 */
export const getTradeDetail = (tid: string) => {
  return Fetch(`/return/trade/${tid}`);
};

/**
 * 查询退单列表
 */
export const fetchOrderReturnList = tid => {
  return Fetch(`/return/findByTid/${tid}`);
};

/**
 * 查询是否可以申请退单
 * @param tid
 * @returns {Promise<IAsyncResult<any>>}
 */
export const fechReturnOrderCanApply = (tid, isRefund) => {
  return Fetch(`/return/returnable/${tid}/${isRefund}`);
};
