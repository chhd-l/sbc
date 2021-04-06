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
      switchChecked: false,
      storePaymentVOs: {},//弹框的form maxAmount
      checkedId: ""

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
  switchChecked(state, content) {
    return state.set('switchChecked', content);
  }

  @Action('method:checkedId')
  checkedId(state, content) {
    return state.set('checkedId', content);
  }


  @Action('method:storePaymentVOs')
  storePaymentVOs(state, content) {
    return state.set('storePaymentVOs', content);
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
