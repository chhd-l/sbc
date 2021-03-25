import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullReductionActor from './actor/full-reduction-actor';
import { fromJS } from 'immutable';
import LoadingActor from './actor/loading-actor';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FullReductionActor(), new LoadingActor()];
  }

  init = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('marketing:reductionBean', res.context);
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
   * @param reductionBean
   * @returns {Promise<void>}
   */
  submitFullReduction = async (reductionBean) => {
    this.dispatch('loading:start');
    let response;
    if (reductionBean.marketingId) {
      response = await webapi.updateFullReduction(reductionBean);
    } else {
      response = await webapi.addFullReduction(reductionBean);
    }
    this.dispatch('loading:end');
    return response;
  };

  setMarketingBean = (bean) => {
    this.dispatch('marketing:reductionBean', bean);
  };

  /**
   * 店铺分类
   * @param discountBean
   * @returns {Promise<void>}
   */
  initCategory = async () => {
    const { res } = await webapi.getGoodsCate();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('goodsActor: initStoreCateList', fromJS(res.context));
    }
  };

  getAllAttribute = async () => {
    let params = {
      attributeName: '',
      displayName: '',
      attributeValue: '',
      displayValue: '',
      pageSize: 10000,
      pageNum: 0
    };
    const { res } = await commonWebapi.getAllAttribute(params);

    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('marketing:attributesList', res.context.attributesList);
    } else {
      // message.error('load group error.');
    }
  };

  reductionBeanOnChange = (bean) => {
    this.dispatch('marketing:reductionBean', bean);
  };
}
