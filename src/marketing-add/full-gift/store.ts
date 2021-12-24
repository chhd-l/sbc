import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, RCi18n } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullGiftActor from './actor/full-gift-actor';
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
    return [new FullGiftActor(), new LoadingActor()];
  }

  init = async (marketingId) => {
    this.dispatch('loading:start');
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      this.dispatch('marketing:giftBean', res.context);
      const scopeArray = res.context.marketingScopeList ? fromJS(res.context.marketingScopeList) : null;
      if (scopeArray) {
        const scopeIds = scopeArray.map((scope) => scope.get('scopeId'));
        const selectedRows = this.makeSelectedRows(scopeIds);
        this.dispatch('marketing:selectedRows', selectedRows);
        this.dispatch('marketing:selectedSkuIds', scopeIds.toJS());
      }
      const selectedGiftRows = this.makeSelectedRows(null);
      //debugger
      this.dispatch('marketing:selectedGiftRows', selectedGiftRows)
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
   * 满赠提交，编辑和新增由marketingId是否存在区分
   * @param giftBean
   * @returns {Promise<void>}
   */
  submitFullGift = async (giftBean) => {
    let response;
    this.dispatch('loading:start');
    if (giftBean.marketingId) {
      response = await webapi.updateFullGift(giftBean);
    } else {
      response = await webapi.addFullGift(giftBean);
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

}
