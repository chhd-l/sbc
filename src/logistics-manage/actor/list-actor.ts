import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ListActor extends Actor {
  defaultState() {
    return {
      // 表格数据
      tableDatas: [],
    };
  }

  @Action('list:table')
  getList(state: IMap, tableDatas) {
    return state.set('tableDatas', fromJS(tableDatas));
  }
}
