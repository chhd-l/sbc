import { Const, Fetch } from 'qmkit';
import * as webapi from '@/order-recommendation-details/webapi';
import { message } from 'antd';

export const fetchOrderList = (filter = {}) => {
  return Fetch<TResult>('/felinReco/list', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

import {TResult} from 'qmkit/type';

/**
 * 详情
 */

 export function fetchFindById(param = {}) {
  return Fetch<TResult>('/recommendation/findById', {
    method: 'POST',
    body: JSON.stringify(param)
  });
}

/**
 * couponCode
 */

export function fetchCouponCode(param = {}) {
  return Fetch<TResult>('/coupon-code/clixray/get');
}

// export function fetchDownloadPDF(felinRecoId) {
//   return Fetch<TResult>(`/api/felinReco/export/${felinRecoId}`, {
//     method: 'GET',
//   });
// }

