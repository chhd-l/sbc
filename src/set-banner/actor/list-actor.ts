import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      // 表格数据
      tableDatas: [],
      form: {
        resourceName: ''
      }
    };
  }
  @Action('list:onFormChange')
  onFormChange(state, { field, value }) {
    return state.setIn(['form', field], value);
  }
  @Action('list:getList')
  getList(state: IMap, params) {
    return state.set('tableDatas', params);
  }
}
