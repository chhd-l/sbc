/**
 * Created by feitingting on 2017/12/13.
 */
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 动态获取支付方式
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchAllPayW() {
  return Fetch<TResult>('/tradeManage/get-store-open-gateways');
}

/**
 * 获取所有支付方式的枚举
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchAllPayWays() {
  return Fetch<TResult>('/finance/bill/pay-methods');
}

/**
 * 获取收入明细
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchIncomeDetail(params: {}) {
  return Fetch<TResult>('/finance/bill/income/details2', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取退款明细
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchRefundDetail(params: {}) {
  return Fetch<TResult>('/finance/bill/refund/details2', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
