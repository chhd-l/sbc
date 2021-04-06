import { Actor, Action, IMap } from 'plume2';
import { fromJS, List } from 'immutable';

export default class PaymentListActor extends Actor {
  defaultState() {
    return {
      storePaymentVOs: {}, //列表 onlinePaymentMethodList, offlinePaymentMethodList, codPaymentMethodList
      paymentForm: {}
    };
  }

  @Action('list:storePaymentVOs')
  storePaymentVOs(state, storePaymentVOs) {
    return state.set('storePaymentVOs', fromJS(storePaymentVOs));
  }

  @Action('list:paymentForm')
  paymentForm(state, { field, value }) {
    return state.setIn(['storePaymentVOs', field], value);
  }
}
