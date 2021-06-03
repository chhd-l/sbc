/**
 * Created by feitingting on 2017/6/20.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class MarketingActor extends Actor {
  defaultState() {
    return {
      marketingName: '',
      beginTime: '',
      endTime: '',
      promotionType: null,
      marketingType: '',
      promotionCode: '',
      publicStatus: '',
      subType: '',
      joinLevel: '',
      customerLevels: [],
      marketingScopeList: [],
      fullReductionLevelList: [],
      fullDiscountLevelList: [],
      marketingFreeShippingLevel: null,
      emailSuffixList: [],
      goodsList: {
        // 商品分页数据
        goodsInfoPage: {
          content: []
        },
        goodses: {},
        brands: {},
        cates: {}
      },
      allGroups: [],
      currentGroup: null,
      scopeType: null,
      storeCateIds: [],
      currentCategary: null,
      currentAttribute: null,
      isSuperimposeSubscription: 1//未勾选
    };
  }

  constructor() {
    super();
  }

  @Action('marketingActor:currentCategary')
  currentCategary(state: IMap, currentCategary) {
    return state.set('currentCategary', currentCategary);
  }

  @Action('marketingActor:currentAttribute')
  currentAttribute(state: IMap, currentAttribute) {
    return state.set('currentAttribute', currentAttribute);
  }

  @Action('marketingActor:init')
  init(state: IMap, data) {
    return state.merge(data);
  }

  @Action('marketingActor:level')
  level(state: IMap, res) {
    return state.set('customerLevels', res);
  }

  @Action('marketingActor:allGroups')
  getAllGroups(state, allGroups) {
    return state.set('allGroups', fromJS(allGroups));
  }

  @Action('marketingActor:currentGroup')
  currentGroup(state, currentGroup) {
    return state.set('currentGroup', currentGroup);
  }
}
