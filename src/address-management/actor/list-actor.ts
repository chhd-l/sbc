import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      // 表格数据
      statesList: [],
      cityList: [],
      // stateCurrentPage: 0,
      // statePageSize: 10,
      statePagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  @Action('list:stateList')
  getStatesList(state: IMap, params) {
    return state.set('statesList', params);
  }

  @Action('list:cityList')
  getCityList(state: IMap, params) {
    return state.set('cityList', params);
  }

  @Action('list:statePagination')
  statePagination(state, statePagination) {
    return state.set('statePagination', statePagination);
  }
}
