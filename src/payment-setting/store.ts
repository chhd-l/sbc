import { Store, IOptions } from 'plume2';
import LoadingActor from './actor/loading-actor'

import * as webapi from './webapi';
//import { message } from 'antd';
import { Const, cache } from 'qmkit';
import { fromJS } from 'immutable';
import PaymentSettingActor from './actor/payment-list-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new PaymentSettingActor(), new LoadingActor()];
  }

  init = async () => {
    const { res } = await webapi.getPaymentSetting();
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('payment:paymentList', fromJS(res.context))
      this.setCurrentTabKey(this.state().get('key') ? this.state().get('key') : res.context[0].payPspItemVOList[0].id)
    }
  }

  setCurrentTabKey = (key) => {
    this.dispatch('payment:key', key)
  }
  setCurrentPaymentForm = (paymentForm) => {
    this.dispatch('payment:paymentForm', paymentForm)
  }

  onFormChange = ({id, field, value}) => {
    debugger
    this.dispatch('payment:onFormChange', { id, field, value })
  }

}
