import { Actor, IMap, Action } from 'plume2';
import { Map } from 'immutable';

export default class ListActor extends Actor {
  defaultState() {
    return {
      // 当前的数据总数
      total: 1, //测试， 之后修改为0
      // 当前的分页条数
      pageSize: 10,
      // 当前页数，从1开始
      currentPage: 1,
      // 表格数据
      tableDatas: [{ id: 1, pcImage: '123.png' }]
    };
  }

  @Action('list:page')
  page(state: IMap, page: IMap) {
    return state.set('currentPage', page.get('currentPage'));
  }

  @Action('list:tableDatas')
  TableDataChange(state: IMap, params) {
    return state.update('tableDatas', params);
  }
}
