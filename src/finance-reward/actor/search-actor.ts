import { Actor, IMap, Action } from 'plume2';
import { cache } from 'qmkit';

/**
 * 查询数据中心
 */
export default class SearchActor extends Actor {
  defaultState() {
    const prescriberSelected = JSON.parse(sessionStorage.getItem('PrescriberSelect'));
    const employee = JSON.parse(sessionStorage.getItem(cache.EMPLOYEE_DATA));
    let exactMatchFlag = false;
    if (employee && employee.roleName && employee.roleName.indexOf('Prescriber') > -1) {
      exactMatchFlag = true;
    }
    return {
      searchForm: {
        period: 60,
        prescriberId: prescriberSelected ? prescriberSelected.prescriberId : '',
        prescriberName: '',
        //auditStatus: -1,
        pageNum: 0,
        pageSize: 10,
        exactMatchFlag: exactMatchFlag
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
