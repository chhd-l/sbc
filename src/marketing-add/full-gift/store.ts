import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullGiftActor from './actor/full-gift-actor';
import { fromJS } from 'immutable';

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
      this.dispatch('loading:end');
      // const scopeArray = res.context.marketingScopeList ? fromJS(res.context.marketingScopeList) : null;
      // if (scopeArray) {
      //   const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
      //   const selectedRows = this.makeSelectedRows(scopeIds);
      //   this.dispatch('marketing:selectedRows', selectedRows);
      //   this.dispatch('marketing:selectedSkuIds', scopeIds.toJS());
      // }
      this.dispatch('marketing:giftBean', res.context);
    } else if (res.code == 'K-080016') {
      history.go(-1);
    } else {
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

  giftBeanOnChange = (bean) => {
    this.dispatch('marketing:giftBean', bean);
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

  initDefualtLevelList= () => {
    this.dispatch('marketing:initBeanLevelList')
  }


  setSelectedProductRows = ({ selectedRows = [], selectedSkuIds = [] }) => {
    this.dispatch('marketing:selectedRows', selectedRows);
    this.dispatch('marketing:selectedSkuIds', selectedSkuIds);
  };

  initGiftDefualtLevelList= () => {
    this.dispatch('marketing:initBeanLevelList')
  }
  setSelectedGiftRows = (rows) => {
    this.dispatch('marketing:selectedGiftRows', rows)
  }

}
