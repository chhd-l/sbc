import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      // 当前的数据总数
      total: 1, //测试， 之后修改为0
      // 当前的分页条数
      pageSize: 10,
      // 当前页数，从1开始
      currentPage: 1,
      // 表格数据
      tableDatas: [],
      form: {
        resourceName: ''
      }
    };
  }

  @Action('list:setTotalPages')
  setTotalPages(state, total) {
    return state.set('total', total);
  }
  @Action('list:setCurrentPage')
  setCurrentPage(state, currentPage) {
    return state.set('currentPage', currentPage);
  }
  @Action('list:onFormChange')
  onFormChange(state, { field, value }) {
    return state.setIn(['form', field], value);
  }
  @Action('list:getList')
  getList(state: IMap, params) {
    debugger;
    return state.set('tableDatas', params);
  }
}
