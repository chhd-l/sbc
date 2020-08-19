import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
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
      sharing: {
        firstName: '',
        lastName: '',
        emailChecked: '',
        email: '',
        phoneNumber: ''
      }
    };
  }

  //初始化
  @Action('list:init')
  init(state: IMap, res) {
    return state.set('dataList', res);
  }

  //Sharing send
  @Action('detail:sharing')
  sharing(state: IMap, { field, value }) {
    return state.setIn(['sharing', field], value);
  }
}
