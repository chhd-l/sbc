import { Actor, Action, IMap } from 'plume2';
import { fromJS, List } from 'immutable';

export default class ListActor extends Actor {
  defaultState() {
    return {
      addStorePayment: {
        img_url: 0,
        isOpen: 0,
        maxAmount: 0,
        name: 'string',
        paymentType: 0,
        pspId: 0,
        storeId: 0
      },
      loading: true
    };
  }

  @Action('Payment:addStorePayment')
  addStorePayment(state: IMap, content) {
    return state.set('addStorePayment', content);
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
