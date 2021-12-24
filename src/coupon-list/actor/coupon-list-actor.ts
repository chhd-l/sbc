import { Action, Actor } from 'plume2';

export default class CouponDetailActor extends Actor {
  defaultState() {
    return {
      //选择的标签
      queryTab: '0',
      couponId: '',
      form: {
        likeCouponName: '',
        couponStatus: null,
        scopeType: null,
        beginTime: null,
        endTime: null,
        couponPurchaseType: null
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      couponList: [],
      loading: true,
      isModalVisible: false
    };
  }

  @Action('tab: change')
  changeTab(state, key) {
    return state.set('queryTab', key);
  }
  @Action('set: couponId')
  setCouponId(state, key) {
    return state.set('couponId', key);
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  @Action('init')
  init(state, { couponList, total, pageNum }) {
    return state.set('couponList', couponList).set('total', total).set('pageNum', pageNum);
  }

  @Action('loading:start')
  start(state) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state) {
    return state.set('loading', false);
  }
  @Action('isModalVisible')
  setIsModalVisible(state,val) {
    return state.set('isModalVisible', val);
  }
}
