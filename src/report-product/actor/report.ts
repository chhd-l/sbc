import { Actor, Action } from 'plume2';
import { Map, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

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
      pageNum: 0,
      // 数据总条数
      total: 0,
      // 每页显示条数
      pageSize: 10,
      // 当前页码
      current: 1
    };
  }

  @Action('report:productStatistics')
  productStatistics(state, data: IMap) {
    return state.set('productStatistics', data);
  }

  @Action('report:productReportPage')
  productReportPage(state: IMap, res: IPageResponse) {
    const { productReport, size, totalElements } = res;
    return state.withMutations((state) => {
      state.set('total', totalElements).set('pageSize', size).set('productReportPage', productReport);
    });
  }

  /**
   * 设置当前页码
   */
  @Action('current')
  current(state: IMap, current) {
    return state.set('current', current);
  }

}
