import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { Const, util, cache } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';
import * as webapi from './webapi';
import CouponListActor from './actor/coupon-list-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CouponListActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const query = this.state().get('form').toJS();
    const couponStatus = this.state().get('queryTab');
    if (query.scopeType == -1) {
      query.scopeType = null;
    }
    if (query.couponStatus == 0) {
      query.couponStatus = null;
    }
    const { res } = await webapi.couponList({
      ...query,
      couponStatus,
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      this.dispatch('loading:start');
      message.error(res.message);
    }
    let couponList = [];
    if (res.context) {
      couponList = res.context.content;
      couponList = couponList.map((coupon) => {
        // 3.1.面值
        if (coupon.fullBuyType == 0) {
          //无门槛
          coupon.denominationStr = `over ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}zero minus ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${coupon.denomination}`;
        } else {
          coupon.denominationStr = `over ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${coupon.fullBuyPrice} minus ${sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}${coupon.denomination}`;
        }
        // 3.2.有效期
        if (coupon.rangeDayType == 0) {
          // 按起止时间
          let startTime = moment(coupon.startTime).format(Const.DAY_FORMAT).toString();
          let endTime = moment(coupon.endTime).format(Const.DAY_FORMAT).toString();
          coupon.startTime = coupon.validity = `${startTime} to ${endTime}`;
        } else {
          // 按N天有效
          coupon.validity = `On the day of collection, valid for ${coupon.effectiveDays} day`;
        }
        // 3.3.优惠券分类
        coupon.cateNamesStr = coupon.cateNames.length == 0 ? '其他' : coupon.cateNames.reduce((a, b) => `${a},${b}`, '').substr(1);
        // 3.4.使用范围
        if ([0, 4].indexOf(coupon.scopeType) != -1) {
          coupon.scopeNamesStr = Const.couponScopeType[coupon.scopeType] + coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1);
        } else {
          coupon.scopeNamesStr = Const.couponScopeType[coupon.scopeType] + ':' + (coupon.scopeNames.length != 0 ? coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1) : '-');
        }
        // 3.5.优惠券状态
        coupon.couponStatusStr = Const.couponStatus[coupon.couponStatus];
        //3.6 使用范围
        if (coupon.scopeType == 0) {
          coupon.scopeNamesStr = 'All products';
        } else if (coupon.scopeType == 4) {
          coupon.scopeNamesStr = 'Partial products';
        }
        return coupon;
      });
      this.dispatch('loading:end');
      this.dispatch('init', {
        couponList: fromJS(couponList),
        total: res.context.totalElements,
        pageNum: pageNum + 1
      });
    }
  };

  onTabChange = (key) => {
    this.dispatch('tab: change', key);
    this.init();
  };

  search = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 删除优惠券
   */
  deleteCoupon = async (id) => {
    const { res } = await webapi.deleteCoupon(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('Operate successfully');
    //刷新页面
    this.init();
  };
  /**
   * 复制优惠券
   */
  copyCoupon = async (id) => {
    const { res } = await webapi.copyCoupon(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('Operate successfully');
    //刷新页面
    this.init();
  };

  couponExport = async (couponId: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            couponId: couponId,
            token: token
          });
          const encrypted = base64.urlEncode(result);
          const exportHref = Const.HOST + `/coupon-info/coupon-code/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
  };
}
