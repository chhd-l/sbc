import { Actor, Action, IMap } from 'plume2';
//import { fromJS, Map } from 'immutable';
//import { IList } from 'typings/globalType';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      loading: true,
      taxesAddVisible: false,
      //列表
      consentList: []
    };
  }

  @Action('texes:taxesAddVisible')
  consentList(state: IMap, res) {
    return state.set('taxesAddVisible', res);
  }

  /**
   * 列表
   */

  @Action('consent:detailList')
  detailList(state: IMap, res) {
    return state.set('detailList', res);
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
