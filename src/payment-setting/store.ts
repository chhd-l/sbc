import { Store, IOptions } from 'plume2';
import LoadingActor from './actor/loading-actor'

import * as webapi from './webapi';
//import { message } from 'antd';
import { Const, cache } from 'qmkit';
import { fromJS } from 'immutable';
import PaymentSettingActor from './actor/payment-list-actor';
import { message } from 'antd';

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
    this.dispatch('loading:start')
    const { res } = await webapi.getPaymentSetting();
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('payment:paymentList', fromJS(res.context))
      this.setCurrentTabKey(this.state().get('key') ? this.state().get('key') : res.context[0].payPspItemVOList[0].id)
      this.dispatch('loading:end')
    } else {
      this.dispatch('loading:end')
    }
  }

  setCurrentTabKey = (key) => {
    this.dispatch('payment:key', key)
  }
  setCurrentPaymentForm = (paymentForm) => {
    this.dispatch('payment:paymentForm', paymentForm)
  }

  onFormChange = ({id, field, value}) => {
    this.dispatch('payment:onFormChange', { id, field, value })
  }

  save = async (params) => {
    this.dispatch('payment:saveLoading', true)
    const { res } = await webapi.savePaymentSetting(params);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      this.handelModelOpenOClose(false);
      this.init()
      this.dispatch('payment:saveLoading', false)
    } else {
      this.dispatch('payment:saveLoading', false)
    }
  }

  handelModelOpenOClose = (visible) => {
    this.dispatch('payment:visible', visible)
  }
}
