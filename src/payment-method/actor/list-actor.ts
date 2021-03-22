import { Actor, Action, IMap } from 'plume2';
import { fromJS, List } from 'immutable';

export default class ListActor extends Actor {
  defaultState() {
    return {
      queryByStoreId: [],
      addStorePayment: {
        img_url: 0,
        isOpen: 0,
        maxAmount: 0,
        name: 'string',
        paymentType: 0,
        pspId: 0,
        storeId: 0
      },
      loading: true,
      switchVisible: false,
      switchChecked: false
    };
  }

  @Action('Payment:queryByStoreId')
  queryByStoreId(state: IMap, content) {
    return state.set('queryByStoreId', content);
  }

  @Action('Payment:addStorePayment')
  addStorePayment(state: IMap, content) {
    return state.set('addStorePayment', content);
  }

  @Action('method:switchVisible')
  switchVisible(state: IMap, content) {
    return state.set('switchVisible', content);
  }

  @Action('method:switchChecked')
  switchChecked(state: IMap, content) {
    return state.set('switchChecked', content);
  }

  @Action('order-return-list:loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('order-return-list:loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
