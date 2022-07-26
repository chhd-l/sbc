import { Fetch } from 'qmkit';
import {TResult} from 'qmkit/type';


/**
 * 分页查询优惠券信息
 */
export const fetchCouponPage = (params) => {
  return Fetch<TResult>('/coupon-info/pageTimeConvert', {
    ///coupon-info/page
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};
