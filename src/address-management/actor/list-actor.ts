import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      // 表格数据
      statesList: [],
      cityList: []
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
}
