import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class CouponDetailActor extends Actor {
  defaultState() {
    return {
      coupon: {
        // 优惠券名称
        couponName: '',
        // 起止时间类型 0：按起止时间，1：按N天有效
        rangeDayType: '',
        // 开始时间
        beginTime: '',
        // 结束时间
        endTime: '',
        // 有效天数
        effectiveDays: '',
        // 优惠券面值
        denomination: 0,
        // 购满类型 0：无门槛，1：满N元可使用
        fullBuyType: '',
        // 购满多少钱
        fullBuyPrice: 0,
        // 是否平台优惠券 0平台 1店铺
        platformFlag: 0,
        // 营销类型(0,1,2,3) 0全部商品，1品牌，2平台类目/店铺分类，3自定义货品（店铺可用）
        scopeType: '',
        // 优惠券说明
        couponDesc: '',
        // 优惠券类型 0通用券 1运费券 2店铺券
        couponType: '',
        couponPurchaseType: 0,
        isSuperimposeSubscription: 1,// 未勾选
        couponPromotionType: null,
        fullbuyCount: null,
        couponJoinLevel: null
      },
      // 优惠券分类
      couponCates: [],
      // 商品品牌
      skuBrands: [],
      // 商品分类
      skuCates: [],
      // 商品
      skus: [],
      goodsList: null,
      currentCategary: null,
      currentAttribute: null,
      allGroups: [],
      currentGroup: null,
      couponActivityConfigPage: {
        content:[]
      },
      loading: false,
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
    };
  }

  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('page')
  init(state, { total, pageNum }) {
    return state.set('total', total).set('pageNum', pageNum);
  }

  @Action('loading')
  loading(state, data) {
    return state.set('loading', data);
  }

  @Action('coupon: detail: field: value')
  fieldsValue(state, { field, value }) {
    return state.set(field, fromJS(value));
  }

  @Action('marketingActor:allGroups')
  getAllGroups(state, allGroups) {
    return state.set('allGroups', fromJS(allGroups));
  }

  @Action('marketingActor:currentGroup')
  currentGroup(state, currentGroup) {
    return state.set('currentGroup', currentGroup);
  }

  @Action('activityConfigPage')
  activityConfigPage(state, data) {
    return state.set('couponActivityConfigPage', data);
  }
}
