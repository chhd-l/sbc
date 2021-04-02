import { Const, Fetch } from 'qmkit';
import * as webapi from '@/order-recommendation-details/webapi';
import { message } from 'antd';

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/felinReco/list', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 详情
 */

export function fetchFindById(param = {}) {
  return Fetch<TResult>('/recommendation/findById', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}
