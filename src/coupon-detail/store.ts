import { Store } from 'plume2';
import { message } from 'antd';
import { Const } from 'qmkit';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import CouponDetailActor from './actor/coupon-info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new CouponDetailActor()];
  }

  /**
   * 初始化信息
   */
  init = async (couponId?: string) => {
    /**获取优惠券详细信息*/
    const { res } = await webapi.fetchCouponInfo(couponId);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        // debugger
        this.dispatch('coupon: detail: field: value', {
          field: 'couponCates',
          value: fromJS(
            res.context.couponInfo.cateNames.length == 0
              ? ['其他']
              : res.context.couponInfo.cateNames
          )
        });

        // 设置优惠券信息
        this.dispatch('coupon: detail: field: value', {
          field: 'coupon',
          value: fromJS(res.context.couponInfo)
        });
        // 设置商品品牌信息
        this.dispatch('coupon: detail: field: value', {
          field: 'skuBrands',
          value: fromJS(res.context.couponInfo.scopeNames)
        });
        // 设置商品分类信息
        this.dispatch('coupon: detail: field: value', {
          field: 'skuCates',
          value: fromJS(res.context.couponInfo.scopeNames)
        });
        // 设置商品列表
        this.dispatch('coupon: detail: field: value', {
          field: 'skus',
          value: fromJS(
            null == res.context.goodsList ? [] : res.context.goodsList
          ) // 设置商品列表
        });
      });
    } else {
      message.error(res.message);
    }
  };
}
