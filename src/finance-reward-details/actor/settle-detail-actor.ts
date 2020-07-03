import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';

export default class SettleDetailActor extends Actor {
  //数据源
  defaultState() {
    return {
      settleList: [],
      settlement: {},
      searchForm: {
        customerName: '',
        orderNo: '',
        payOrderStatus: null,
        invoiceState: null
      },
      dateRange: {
        beginTime: moment(new Date())
          .format('YYYY-MM-DD')
          .toString(),
        endTime: moment(new Date())
          .format('YYYY-MM-DD')
          .toString()
      },
      tabKey: '1',
      //导出单独的时间参数
      searchTime: {}
    };
  }

  constructor() {
    super();
  }

  @Action('settleDetail:settlement')
  settlement(state: IMap, settlement) {
    return state.set('settlement', fromJS(settlement));
  }

  @Action('settleDetail:list')
  list(state: IMap, settleList) {
    return state.set('settleList', fromJS(settleList));
  }

  /**
   * 修改搜索框
   * @param state
   * @param field
   * @param value
   * @returns {Map<K, V>}
   */
  @Action('change:searchForm')
  searchForm(state: IMap, { field, value }) {
    return state.setIn(['searchForm', field], value);
  }

  @Action('finance:searchTime')
  searchTime(state: IMap, searchTime: IMap) {
    return state.set('searchTime', searchTime);
  }
}
