import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
//import { Link } from 'react-router-dom';
import { history } from 'qmkit';

import moment from 'moment';
interface ISettleInvoiceResponse {
  content: Array<any>;
  pageSize: number;
  total: number;
}
export default class SettleDetailActor extends Actor {
  Link;
  //数据源
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 当前页数，从1开始
      currentPage: 1,
      current: 1,
      //当前的退单列表
      setList: [],
      dataList: [],
      settlement: [],
      //开始时间
      beginTime: '',
      //结束时间
      endTime: '',
      searchForm: {
        prescriberId: '',
        beginTime: moment(
          new Date(sessionStorage.getItem('defaultLocalDateTime'))
        )
          .format('YYYY-MM-DD')
          .toString(),
        endTime: moment(
          new Date(sessionStorage.getItem('defaultLocalDateTime'))
        )
          .format('YYYY-MM-DD')
          .toString(),
        /* beginTime: '2020-05-01',
        endTime: '2020-07-01',*/
        pageNum: 0,
        pageSize: 10
      },
      echartsData: {},
      setName: {},
      dateRange: {
        beginTime: moment(
          new Date(sessionStorage.getItem('defaultLocalDateTime'))
        )
          .format('YYYY-MM-DD')
          .toString(),
        endTime: moment(
          new Date(sessionStorage.getItem('defaultLocalDateTime'))
        )
          .format('YYYY-MM-DD')
          .toString()
      },
      tabKey: '1',
      //导出单独的时间参数
      searchTime: {},
      fetchFindListByPrescriber: {},
      onRewardExportData: {},
      id: '',
      prescriber: {}
    };
  }

  //初始化
  @Action('list:init')
  init(state: IMap, res) {
    return state.set('dataList', res);
  }

  //chart数据
  @Action('list:EchartsData')
  EchartsData(state: IMap, EchartsData) {
    return state.set('EchartsData', EchartsData);
  }
  //列表数据
  @Action('ticket:onRewardExport')
  onRewardExport(state: IMap, onRewardExportData) {
    return state.set('onRewardExportData', onRewardExportData);
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
  @Action('list:fetchFindListByPrescriber')
  fetchFindListByPrescriber(state: IMap, fetchFindListByPrescriber) {
    return state.set('fetchFindListByPrescriber', fetchFindListByPrescriber);
  }
  @Action('form:field')
  formFieldChange(state, { field, value }) {
    return state.setIn(['form', field], value);
  }

  @Action('form:clear')
  formFieldClear(state: IMap) {
    return state.set('form', Map());
  }

  //getPrescribe 文本
  @Action('getPrescribe:prescriber')
  prescriber(state: IMap, res) {
    return state.set('prescriber', res);
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

  /**
   * 改变日期范围
   * @param state
   * @param param
   */
  @Action('finance:dateRange')
  dateRange(state: IMap, param) {
    return state.setIn(['dateRange', param['field']], param['value']);
  }
}
