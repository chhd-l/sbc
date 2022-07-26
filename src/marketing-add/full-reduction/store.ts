import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, RCi18n } from 'qmkit';

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
  initReductionDefualtLevelList= () => {
    this.dispatch('marketing:initReductionBeanLevelList')
  }
  init = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      if (res.context.promotionType === 1 || res.context.promotionType === 2) {
        res.context.firstSubscriptionOrderReduction = res.context.fullReductionLevelList ? res.context.fullReductionLevelList[0].firstSubscriptionOrderReduction: null;
        res.context.restSubscriptionOrderReduction = res.context.fullReductionLevelList ? res.context.fullReductionLevelList[0].restSubscriptionOrderReduction: null;
      }
      if(!res.context.marketingUseLimit){
        res.context.marketingUseLimit={
          perCustomer:1,
          isNotLimit:1
        }
      }
      res.context.customProductsType=res.context?.customProductsType??0
      this.dispatch('marketing:reductionBean', res.context);
      const scopeArray = res.context.marketingScopeList ? fromJS(res.context.marketingScopeList) : null;
      if (scopeArray) {
        const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
        const selectedRows = this.makeSelectedRows(scopeIds);
        this.dispatch('marketing:selectedRows', selectedRows);
        this.dispatch('marketing:selectedSkuIds', scopeIds.toJS());
      }
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

  setSelectedProductRows = ({ selectedRows = [], selectedSkuIds = [] }) => {
    this.dispatch('marketing:selectedRows', selectedRows);
    this.dispatch('marketing:selectedSkuIds', selectedSkuIds);
  };






  initShipping = async (marketingId) => {
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
      this.setMarketingType(3)
      this.dispatch('loading:end');
    } else if (res.code == 'K-080016') {
      //
      history.go(-1);
      this.dispatch('loading:end');
    }
  };

  shippingBeanOnChange = (shippingBean) => {
    this.dispatch('marketing:shippingBean', shippingBean);
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
  toParams = ({ marketingId,publicStatus, marketingName, beginTime, endTime, subType, shippingValue, shippingItemValue, joinLevel, segmentIds, promotionCode, promotionType, isSuperimposeSubscription }) => {
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
      publicStatus,
      promotionType,
      isSuperimposeSubscription,
      promotionCode: promotionCode ? promotionCode : this.randomPromotionCode()
    };
  };

  setMarketingType = (marketingType) => {
    this.dispatch('marketing:marketingType', marketingType)
  }
  randomPromotionCode = () => {
    const randomNumber = ('0'.repeat(8) + parseInt(Math.pow(2, 40) * Math.rdmValue()).toString(32)).slice(-8);
    const timeStamp = new Date(sessionStorage.getItem('defaultLocalDateTime')).getTime().toString().slice(-10);
    const promotionCode = randomNumber + timeStamp;
    return promotionCode;
  };
}
