import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';
import MarketingActor from './common/actor/marketing-actor';
import GiftActor from './gift-details/actor/gift-actor';
import LeafletActor from './leaflet-details/actor/leaflet-actor';
import LoadingActor from './common/actor/loading-actor';
import { Const, util } from 'qmkit';
import * as commonWebapi from '@/marketing-add/webapi';
import * as React from 'react';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new MarketingActor(), new GiftActor(), new LoadingActor(), new LeafletActor()];
  }

  init = async (marketingId?: string) => {
    this.dispatch('loading:start')
    const marketing = await webapi.fetchMarketingInfo(marketingId);
    if (marketing.res.code == Const.SUCCESS_CODE) {
      this.dispatch('marketingActor:init', marketing.res.context);

      if(marketing.res.context.joinLevel == -3) {
        this.setCurrentGroup(marketing.res.context.segmentIds[0])
      }
      if (marketing.res.context.marketingType == '2') {
        const gift = await webapi.fetchGiftList({ marketingId: marketingId });
        if (gift.res.code == Const.SUCCESS_CODE) {
          this.dispatch('giftActor:init', fromJS(gift.res.context));
        }
      }
      if (marketing.res.context.marketingType == '4') {
        const leaflet = await webapi.fetchLeafletList({ marketingId: marketingId });
        if (leaflet.res.code === Const.SUCCESS_CODE) {
          this.dispatch('leafletActor:init', fromJS({ leafletLevelList: leaflet.res.context?.levelList ?? [], leafletList: leaflet.res.context?.giftList ?? []}));
        }
      }
      if(marketing.res.context.scopeType == 2) { //category
        this.seCurrentCategory(marketing.res.context.storeCateIds)
      } else if(marketing.res.context.scopeType == 3) { //Attribute
        this.setCurrentAttribute(marketing.res.context.attributeValueIds)
      }
    }
    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }
    this.dispatch('marketingActor:level', fromJS(levelList));
    this.dispatch('loading:end')
  };


  setCurrentGroup = async (id) => {
    const { res } = await webapi.getAllGroups({
      pageNum: 0,
      pageSize: 1000000,
      segmentType: 0
    });

    if (res.code == Const.SUCCESS_CODE) {
      const allGroups =  res.context.segmentList
      const group = allGroups.find(item=> item.id == id)
      this.dispatch('marketingActor:allGroups', fromJS(res.context.segmentList));
      this.dispatch('marketingActor:currentGroup', fromJS(group));
    } else {
      // message.error('load group error.');
    }
  };

  /**
   * 店铺分类
   * @param discountBean
   * @returns {Promise<void>}
   */
  seCurrentCategory = async (storeCateIds) => {
    const { res } = await webapi.getGoodsCate();
    if (res && res.code === Const.SUCCESS_CODE) {
      const allCategary = res.context
      let  currentCategary = []
       allCategary.map(item => {
         storeCateIds.map(cate => {
           if(item.storeCateId == cate) {
             currentCategary.push(item)
           }
         })
      })
      this.dispatch('marketingActor:currentCategary', fromJS(currentCategary));
    }
  };


  setCurrentAttribute = async (attributeValueIds) => {
    let params = {
      attributeName: '',
      displayName: '',
      attributeValue: '',
      displayValue: '',
      pageSize: 10000,
      pageNum: 0
    };
    const { res } = await webapi.getAllAttribute(params);
    if (res.code == Const.SUCCESS_CODE) {
      let  currentAttribute = []
      let attributesList = fromJS(res.context.attributesList)
      attributesList = this.generateAttributeTree(attributesList)
      attributesList = attributesList.toJS().flat(2)
      attributesList.map(item => {
        attributeValueIds.map(attribute => {
          if(item.id == attribute) {
            currentAttribute.push(item)
          }
        })
      })
      this.dispatch('marketingActor:currentAttribute', fromJS(currentAttribute));
    } else {
      // message.error('load group error.');
    }
  };

  /**
   * Attribute分类树形下拉框
   * @param storeCateList
   */
  generateAttributeTree = (attributesList) => {
    return (
      attributesList &&
      attributesList.map((item) => {
        if (item.get('attributesValuesVOList') && item.get('attributesValuesVOList').count()) {
          return (
            this.generateAttributeTree(item.get('attributesValuesVOList'))
        );
        }
        return item
      })
    );
  };
}
