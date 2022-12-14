import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, RCi18n } from 'qmkit';

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
      let _result=res.context;
      if ([1,2,4].includes(_result.promotionType)) {
        _result.firstSubscriptionOrderDiscount = _result.fullDiscountLevelList && _result.fullDiscountLevelList[0].firstSubscriptionOrderDiscount
          ? (_result.fullDiscountLevelList[0].firstSubscriptionOrderDiscount * 100 ).toFixed(): null;
          _result.restSubscriptionOrderDiscount = _result.fullDiscountLevelList && _result.fullDiscountLevelList[0].restSubscriptionOrderDiscount
          ? (_result.fullDiscountLevelList[0].restSubscriptionOrderDiscount * 100).toFixed() : null;
          _result.firstSubscriptionLimitAmount = _result.fullDiscountLevelList && _result.fullDiscountLevelList[0].firstSubscriptionLimitAmount
          ? _result.fullDiscountLevelList[0].firstSubscriptionLimitAmount: null;
          _result.restSubscriptionLimitAmount = _result.fullDiscountLevelList && _result.fullDiscountLevelList[0].restSubscriptionLimitAmount
          ? _result.fullDiscountLevelList[0].restSubscriptionLimitAmount: null;
      }
      if(!_result.marketingUseLimit){
        _result.marketingUseLimit={
          perCustomer:1,
          isNotLimit:1
        }
      }
      _result.customProductsType=_result?.customProductsType??0
      // debugger
      this.dispatch('marketing:initDiscountBean', _result);
      const scopeArray = _result.marketingScopeList ? fromJS(_result.marketingScopeList) : null;
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
   * ???skuIds?????????gridSource
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
   * ???????????????????????????
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
   * ??????select groups
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
   * ?????????????????????????????????marketingId??????????????????
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
    if(response.res && response.res.code === Const.SUCCESS_CODE) {
      message.success((window as any).RCi18n({
        id: 'Marketing.OperateSuccessfully'
      }))
      history.push('/marketing-list');
    } else if(response.res && response.res.code === 'K-080217') {
      message.error((window as any).RCi18n({
        id: 'Marketing.PomotionCodehasexited'
      }))
    }
    return response
  };
  //

  /**
   * ????????????
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
