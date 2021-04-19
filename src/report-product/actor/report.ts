import { Actor, Action } from 'plume2';
import { Map, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';
import moment from 'moment';

interface IPageResponse {
  productReport: Array<any>;
  size: number;
  totalElements: number;
}

export default class BrandActor extends Actor {
  defaultState() {
    return {
      productStatistics: '',
      productReportPage: [],
      pageNum: 1,
      // 数据总条数
      total: 0,
      // 每页显示条数
      pageSize: 10,
      // 当前页码
      current: 1,
      getDate: {},
      getForm: '',
      loading: true,
      skuText: '',
      beginDate: moment(sessionStorage.getItem('defaultLocalDateTime'), 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD'),
      endDate: moment(sessionStorage.getItem('defaultLocalDateTime'), 'YYYY-MM-DD').format('YYYY-MM-DD')
    };
  }
  @Action('report:field')
  productFieldOnChange(state, {field, value}) {
    return state.set(field, value);
  }

  @Action('report:productSkuText')
  productSkuText(state, skuText) {
    return state.set('skuText', skuText);
  }

  @Action('report:productStatistics')
  productStatistics(state, data: IMap) {
    return state.set('productStatistics', data);
  }

  @Action('report:productReportPage')
  productReportPage(state: IMap, res: IPageResponse) {
    debugger
    const { productReport, pageSize, totalElements } = res;
    return state.withMutations((state) => {
      state.set('total', totalElements).set('pageSize', pageSize).set('productReportPage', fromJS(productReport));
    });
  }

  /**
   * 设置当前页码
   */
  @Action('current')
  current(state: IMap, current) {
    return state.set('current', current);
  }

  @Action('report:getDate')
  getDate(state, data: IMap) {
    return state.set('getDate', data);
  }

  @Action('report:getForm')
  getForm(state, data: IMap) {
    return state.set('getForm', data);
  }

  //loading
  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
