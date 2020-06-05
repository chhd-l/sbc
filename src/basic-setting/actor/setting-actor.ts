import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      settings: {
        storeId: '', // 店铺标识
        storeLogo: '', // 店铺logo
        storeSign: '', // 店招
        storeName: '',
        contactPerson: '',
        contactMobile: '',
        contactEmail: ''
      }
    };
  }

  @Action('setting:init')
  init(state: IMap, setting) {
    return state.mergeIn(['settings'], setting);
  }
}
