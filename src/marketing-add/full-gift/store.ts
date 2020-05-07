import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullGiftActor from './actor/full-gift-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FullGiftActor()];
  }

  init = async (marketingId) => {
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('marketing:giftBean', res.context);
    } else if (res.code == 'K-080016') {
      message.error(res.message);
      history.go(-1);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 满赠提交，编辑和新增由marketingId是否存在区分
   * @param giftBean
   * @returns {Promise<void>}
   */
  submitFullGift = async (giftBean) => {
    let response;
    if (giftBean.marketingId) {
      response = await webapi.updateFullGift(giftBean);
    } else {
      response = await webapi.addFullGift(giftBean);
    }
    return response;
  };
}
