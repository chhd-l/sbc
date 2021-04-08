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
  initDefualtLevelList= () => {
    this.dispatch('marketing:initBeanLevelList')
  }
  init = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      if (res.context.promotionType === 1 || res.context.promotionType === 2) {
        res.context.firstSubscriptionOrderDiscount = res.context.fullDiscountLevelList ? res.context.fullDiscountLevelList[0].firstSubscriptionOrderDiscount * 10 : null;
        res.context.restSubscriptionOrderDiscount = res.context.fullDiscountLevelList ? res.context.fullDiscountLevelList[0].restSubscriptionOrderDiscount * 10 : null;
      }
      this.dispatch('marketing:initDiscountBean', res.context);
      const scopeArray = res.context.marketingScopeList ? fromJS(res.context.marketingScopeList) : null;
      if (scopeArray) {
        const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
        const selectedRows = this.makeSelectedRows(scopeIds);
        this.dispatch('marketing:selectedRows', selectedRows);
        this.dispatch('marketing:selectedSkuIds', scopeIds.toJS());
      }
    } else if (res.code == 'K-080016') {
      //
      this.dispatch('loading:end');
      history.go(-1);
    }
  };

  /**
   * 将skuIds转换成gridSource
   * @param scopeIds
   * @returns {any}
   */
  makeSelectedRows = (scopeIds) => {
    const marketingBean = this.state().get('marketingBean');
    const goodsList = marketingBean.get('goodsList');
    if (goodsList) {
      const goodsList = marketingBean.get('goodsList');
      let selectedRows;
      if (scopeIds) {
        selectedRows = goodsList
          .get('goodsInfoPage')
          .get('content')
          .filter((goodInfo) => scopeIds.includes(goodInfo.get('goodsInfoId')));
      } else {
        selectedRows = goodsList.get('goodsInfoPage').get('content');
      }
      return fromJS(
        selectedRows.toJS().map((goodInfo) => {
          const cId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('cateId');
          const cate = fromJS(goodsList.get('cates') || []).find((s) => s.get('cateId') === cId);
          goodInfo.cateName = cate ? cate.get('cateName') : '';

          const bId = fromJS(goodsList.get('goodses'))
            .find((s) => s.get('goodsId') === goodInfo.goodsId)
            .get('brandId');
          const brand = fromJS(goodsList.get('brands') || []).find((s) => s.get('brandId') === bId);
          goodInfo.brandName = brand ? brand.get('brandName') : '';
          return goodInfo;
        })
      );
    } else {
      return fromJS([]);
    }
  };

  /**
   * 已选商品的删除方法
   * @param skuId
   */
  deleteSelectedSku = (skuId) => {
    let selectedRows = this.state().get('selectedRows');
    let selectedSkuIds = this.state().get('selectedSkuIds');
    selectedSkuIds.splice(
      selectedSkuIds.findIndex((item) => item == skuId),
      1
    );
    selectedRows = selectedRows.delete(selectedRows.findIndex((row) => row.get('goodsInfoId') == skuId));
    this.dispatch('marketing:selectedRows', selectedRows);
    this.dispatch('marketing:selectedSkuIds', selectedSkuIds);
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

  discountBeanOnChange = (bean) => {
    this.dispatch('marketing:discountBean', bean);
  };

  setSelectedProductRows = ({ selectedRows = [], selectedSkuIds = [] }) => {
    this.dispatch('marketing:selectedRows', selectedRows);
    this.dispatch('marketing:selectedSkuIds', selectedSkuIds);
  };
}
