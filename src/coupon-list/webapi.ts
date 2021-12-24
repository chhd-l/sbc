import { Fetch } from 'qmkit';
type TResult = {
  code:string,
  message:string,
  context:any
}
/**
 * 获取优惠券列表
 */
export function couponList(params) {
  return Fetch<TResult>('/coupon-info/pageTimeConvert', {
    ///coupon-info/page
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 删除优惠券
 */
export function deleteCoupon(id) {
  return Fetch<TResult>(`/coupon-info/${id}`, { method: 'DELETE' });
}

/**
 * 复制优惠券
 */
export function copyCoupon(id) {
  return Fetch<TResult>(`/coupon-info/copy/${id}`, { method: 'GET' });
}

/**
 * 新增优惠券活动
 */
export function addCouponActivity (params) {
  return Fetch<TResult>('/coupon-activity/add', {
    method: 'POST',
    body: JSON.stringify(params)
  },{isHandleResult:true,isShowLoading:true,customerTip:true});
};