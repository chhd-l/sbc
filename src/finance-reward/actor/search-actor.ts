import { Actor, IMap, Action } from 'plume2';

/**
 * 查询数据中心
 */
export default class SearchActor extends Actor {
  defaultState() {
    return {
      searchForm: {
        period: 60,
        prescriberID: '',
        prescriberName: '',
        //auditStatus: -1,
        pageNum: 0,
        pageSize: 10
      },
      searchList: ''
    };
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
  @Action('search:searchList')
  searchList(state: IMap, { field, value }) {
    return state.setIn(['searchList', field], value);
  }
}
