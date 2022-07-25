import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FreeShippingActor from './actor/free-shipping-actor';
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
    return [new FreeShippingActor(), new LoadingActor()];
  }

  init = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      let shipping = {};
      if (res.context.marketingFreeShippingLevel) {
        shipping = {
          shippingValue: res.context.marketingFreeShippingLevel ? res.context.marketingFreeShippingLevel.fullAmount : null,
          shippingItemValue: res.context.marketingFreeShippingLevel ? res.context.marketingFreeShippingLevel.fullCount : null
        };
      }
      this.dispatch('marketing:shippingBean', fromJS({ ...res.context, ...shipping }));
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
      segmentType: 0,
      isPublished: 1
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
    const params = this.toParams(shippingBean);
    this.dispatch('loading:start');
    if (params.marketingId) {
      const { res } = await webapi.updateFreeShipping(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        history.push('/marketing-list');
      }
      this.dispatch('loading:end');
    } else {
      const { res } = await webapi.addFreeShipping(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        history.push('/marketing-list');
      }
      this.dispatch('loading:end');
    }
  };
  toParams = ({ marketingId, marketingName, beginTime, endTime, subType, shippingValue, shippingItemValue, joinLevel, segmentIds, promotionCode, promotionType }) => {
    return {
      marketingType: 3, //免邮
      marketingName,
      beginTime,
      endTime,
      subType,
      marketingFreeShippingLevel: { fullAmount: shippingValue, fullCount: shippingItemValue },
      joinLevel,
      segmentIds,
      scopeType: 0,
      marketingId,
      publicStatus: 1,
      promotionType,
      promotionCode: promotionCode ? promotionCode : this.randomPromotionCode()
    };
  };

  shippingBeanOnChange = (shippingBean) => {
    this.dispatch('marketing:shippingBean', shippingBean);
  };

  randomPromotionCode = () => {
    const randomNumber = ('0'.repeat(8) + parseInt(Math.pow(2, 40) * (window.crypto.getRandomValues(new Uint8Array(1)) * 0.001)).toString(32)).slice(-8);
    const timeStamp = new Date(sessionStorage.getItem('defaultLocalDateTime')).getTime().toString().slice(-10);
    const promotionCode = randomNumber + timeStamp;
    return promotionCode;
  };
}
