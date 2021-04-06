import { Actor, Action, IMap } from 'plume2';
import { fromJS, List } from 'immutable';

export default class PaymentSettingActor extends Actor {
  defaultState() {
    return {
      paymentList: [],
      paymentForm: {},
      key: null //当前tab id
    };
  }

  @Action('payment:key')
  storePaymentVOs(state, key) {
    return state.set('key', key);
  }
  @Action('payment:paymentForm')
  paymentForm(state, paymentForm) {
    return state.set('paymentForm', paymentForm);
  }
  @Action('payment:paymentList')
  paymentList(state, paymentList) {
    return state.set('paymentList', paymentList);
  }

  @Action('payment:onFormChange')
  onFormChange(state, { id, field, value }) {
    let paymentForm = state.get('paymentForm').toJS()
    paymentForm.payPspItemVOList.map(item => {
      if(item.id === id) {
        if(field == 'isOpen' || field == 'supportSubscription' || field == 'payPspItemCardTypeVOList' || field == 'maxAmount') {
          item[field] = value
        } else {
          item.pspConfigVO[field] = value
        }
      }
    })
    return state.set('paymentForm', fromJS(paymentForm));
  }


}
