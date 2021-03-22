import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullDiscountActor from './actor/full-discount-actor';
import LoadingActor from './actor/loading-actor';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FullDiscountActor(), new LoadingActor()];
  }

  init = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      this.dispatch('marketing:discountBean', res.context);
    } else if (res.code == 'K-080016') {
      //
      this.dispatch('loading:end');
      history.go(-1);
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
  submitFullDiscount = async (discountBean) => {
    let response;
    this.dispatch('loading:start');
    if (discountBean.marketingId) {
      response = await webapi.updateFullDiscount(discountBean);
    } else {
      response = await webapi.addFullDiscount(discountBean);
    }
    this.dispatch('loading:end');
    return response;
  };
  //

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
}
