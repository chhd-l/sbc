import { Store } from 'plume2';

import { cache, Const } from 'qmkit';
import { message } from 'antd';
import { fromJS } from 'immutable';
import moment from 'moment';

import * as webapi from './webapi';
import CouponActivityDetailActor from './actor/coupon-activity.actor';
import LoadingActor from './actor/loading-actor';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new LoadingActor(), new CouponActivityDetailActor()];
  }

  init = async (id) => {
    this.dispatch('loading:start');
    const { res } = await webapi.activityDetail(id);
    if (res.code != Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
    }
    //拼装页面需要展示的参数 couponInfoList
    let { couponInfoList, couponActivityConfigList, couponActivity, customerDetailVOS } = res.context;
    couponInfoList = couponInfoList.map((item) => {
      if (item.rangeDayType == 0) {
        item.time = moment(item.startTime).format(Const.TIME_FORMAT).toString() + ' to ' + moment(item.endTime).format(Const.TIME_FORMAT).toString();
      } else {
        item.time = `Day of collection${item.effectiveDays}Valid within days`;
      }
      if (item.fullBuyType == 0) {
        item.price = `full ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}0 minus ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${item.denomination}`;
      } else {
        item.price = `full ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${item.fullBuyPrice} minus ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${item.denomination}`;
      }
      const config = couponActivityConfigList.find((config) => config.couponId == item.couponId);
      item.totalCount = config.totalCount;
      return item;
    });
    res.context.couponInfoList = couponInfoList;

    if (couponActivity.joinLevel == -2 && customerDetailVOS) {
      // 指定活动用户范围
      customerDetailVOS = customerDetailVOS.map((item) => {
        let customer = {} as any;
        customer.customerId = item.customerId;
        // 用户名
        customer.customerName = item.customerAccount;
        // 账号
        customer.customerAccount = item.customerAccount;
        return customer;
      });
      res.context.customerDetailVOS = customerDetailVOS;
    }
    this.dispatch('loading:end');
    this.dispatch('init', fromJS(res.context));
  };

  /**
   * 切换tab页
   */
  onTabChange = (key) => {
    this.dispatch('tab: change', key);
  };
}
