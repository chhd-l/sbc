import { Fetch } from 'qmkit';
import {TResult2 as TResult } from 'qmkit/type';

// type TResult = {
//   code: string;
//   message: string;
// };

/**
 * 查询物流公司列表
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchLogisticCompany() {
  return Fetch<TResult>('/store/expressCompany/all');
}
