import { Fetch } from 'qmkit';
import { TResult } from '../../typings/global';

/**
 * 导出请求
 * @param params 
 * @returns 
 */
export const batchExportMain = (params) => {
  return Fetch<TResult>('/trade/async/export/order', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 * 获取订单页的 Object 选项
 * @returns 
 */
export const getOrderSelect = () => {
  return Fetch<TResult>('/order/config/getExportDescByConfigKeyAndDelFlag', {
    method: 'GET'
  });
};
