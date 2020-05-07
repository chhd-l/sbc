import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullReductionActor from './actor/full-reduction-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FullReductionActor()];
  }

  init = async (marketingId) => {
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('marketing:reductionBean', res.context);
    } else if (res.code == 'K-080016') {
      message.error(res.message);
      history.go(-1);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 满折提交，编辑和新增由marketingId是否存在区分
   * @param reductionBean
   * @returns {Promise<void>}
   */
  submitFullReduction = async (reductionBean) => {
    let response;
    if (reductionBean.marketingId) {
      response = await webapi.updateFullReduction(reductionBean);
    } else {
      response = await webapi.addFullReduction(reductionBean);
    }
    return response;
  };
}
