import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FreeShippingActor from './actor/free-shipping-actor';
import LoadingActor from './actor/loading-actor';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FreeShippingActor(), new LoadingActor()];
  }

  init = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('marketing:discountBean', res.context);
      this.dispatch('loading:end');
    } else if (res.code == 'K-080016') {
      //
      history.go(-1);
      this.dispatch('loading:end');
    }
  };
  /**
   * 获取select groups
   *
   *
   */

  getAllGroups = async () => {
    const { res } = await commonWebapi.getAllGroups({
      pageNum: 0,
      pageSize: 1000000,
      segmentType: 0
    });

    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('marketing:allGroups', res.context.segmentList);
    } else {
      // message.error('load group error.');
    }
  };
  /**
   * 满折提交，编辑和新增由marketingId是否存在区分
   * @param discountBean
   * @returns {Promise<void>}
   */
  submitFreeShipping = async (shippingBean) => {
    let response;
    this.dispatch('loading:start');
    if (shippingBean.marketingId) {
      response = await webapi.updateFullDiscount(shippingBean);
      this.dispatch('loading:end');
    } else {
      response = await webapi.addFullDiscount(shippingBean);
      this.dispatch('loading:end');
    }
    return response;
  };
}
