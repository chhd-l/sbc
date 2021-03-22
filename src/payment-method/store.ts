import { Store, IOptions } from 'plume2';
import ListActor from './actor/list-actor';

import * as webapi from './webapi';
//import { message } from 'antd';
import { Const, cache } from 'qmkit';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ListActor()];
  }

  onShow = (res) => {
    this.dispatch('method:switchVisible', res);
  };

  onChecked = (res) => {
    console.log(res, 3333333);

    this.dispatch('method:switchChecked', res);
  };

  init = async () => {
    const { res } = await webapi.queryByStoreId();

    if (res.code === Const.SUCCESS_CODE) {
      let storePaymentVOs = res.context.storePaymentVOs || [];
      let List1 = [];
      let List2 = [];
      let List3 = [];
      storePaymentVOs.map((item) => {
        if (item.paymentType === 0) {
          List1.push(item);
        } else if (item.paymentType === 1) {
          List2.push(item);
        }
        if (item.paymentType === 2) {
          List3.push(item);
        }
      });
      this.dispatch('Payment:queryByStoreId', { List1, List2, List3 });
    }
  };

  getStorePaymentVOs = async (res) => {
    this.dispatch('method:storePaymentVOs', res);
  };

  getEditStorePayment = async (pram) => {
    const { res } = await webapi.editStorePayment(pram);

    if (res.code === Const.SUCCESS_CODE) {
      console.log(res, 11111111111);
    }
  };

  /**
   * 保存账号名称
   * @param form
   * @returns {Promise<void>}
   */
}
