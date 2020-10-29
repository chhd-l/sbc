import { Actor, Action } from 'plume2';
import { Map } from 'immutable';
import { IMap } from 'typings/globalType';

export default class BrandActor extends Actor {
  defaultState() {
    return {
      productReportPage: '',
      pageNum: 0,
      pageSize: 10
    };
  }

  @Action('report:productReportPage')
  productReportPage(state, data: IMap) {
    return state.set('productReportPage', data);
  }
}
