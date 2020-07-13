import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
//import { Link } from 'react-router-dom';
import { history } from 'qmkit';

import moment from 'moment';
interface IOrderInvoiceResponse {
  content: Array<any>;
  pageSize: number;
  total: number;
}
export default class SettleDetailActor extends Actor {
  Link;
  //数据源
  defaultState() {
    return {
      settlement: {},
      searchForm: {
        prescriberId: '',
        beginTime: '2020-06-01',
        endTime: '2020-07-08',
        pageNum: 0,
        pageSize: 10
      },
      setName: {},
      dateRange: {
        beginTime: moment(new Date()).format('YYYY-MM-DD').toString(),
        endTime: moment(new Date()).format('YYYY-MM-DD').toString()
      },
      tabKey: '1',
      //导出单独的时间参数
      searchTime: {}
    };
  }

  constructor(props) {
    super(props);

    //console.log(history.location.params.prescriberId,222222222222222222222);
  }
  @Action('list:init')
  init(state: IMap, init) {
    //const { content, pageSize, total } = res;
    //console.log(res,2222222222222);
    return state.set('setlist', init);
    /* return state.withMutations(state => {
      state
        .set('total', total)
        .set('pageSize', pageSize)
        .set('dataList', fromJS(content));
    });*/
  }

  @Action('list:echarts')
  echartsData(state: IMap, echarts) {
    return state.set('echarts', echarts);
  }

  @Action('list:PeriodAmountTotal')
  PeriodAmountTotal(state: IMap, PeriodAmountTotal) {
    return state.set('PeriodAmountTotal', PeriodAmountTotal);
  }

  @Action('list:FindListByPrescriber')
  FindListByPrescriber(state: IMap, FindListByPrescriber) {
    return state.set('FindListByPrescriber', FindListByPrescriber);
  }

  @Action('settleDetail:settlement')
  settlement(state: IMap, settlement) {
    return state.set('settlement', fromJS(settlement));
  }

  @Action('settleDetail:list')
  list(state: IMap, settleList) {
    return state.set('settleList', fromJS(settleList));
  }

  @Action('list:setName')
  setName(state: IMap, setName) {
    return state.set('setName', fromJS(setName));
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
