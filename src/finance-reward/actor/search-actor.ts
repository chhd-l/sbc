import { Actor, IMap, Action } from 'plume2';

/**
 * 查询数据中心
 */
export default class SearchActor extends Actor {
  defaultState() {
    return {
      searchForm: {
        customerName: '',
        prescriberID: '',
        prescriberName: '',
        payOrderStatus: null,
        invoiceState: null
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
