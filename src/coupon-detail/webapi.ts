import { Fetch } from 'qmkit';

export const fetchCouponInfo = (couponId: string) => {
  return Fetch<TResult>(`/coupon-info/${couponId}`);
};
