import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ListActor extends Actor {
  defaultState() {
    return {
      // 表格数据
      tableDatas: [],
      settingStatus: true,
    };
  }

  @Action('list:table')
  getList(state: IMap, tableDatas) {
    return state.set('tableDatas', fromJS(tableDatas));
  }
  @Action('list:field')
  listField(state: IMap, {field, value }) {
    return state.set(field, value);
  }
}
