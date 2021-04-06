import { Store, IOptions } from 'plume2';
import ListActor from './actor/list-actor';
import PaymentListActor from  './actor/payment-list-actor'
import LoadingActor from './actor/loading-actor'

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
    return [new ListActor(), new PaymentListActor(), new LoadingActor()];
  }

  onShow = (res) => {
    this.dispatch('method:switchVisible', res);
  };

  onChecked = (res) => {
    this.dispatch('method:switchChecked', res);
  };

  init2 = async () => {
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
      //console.log(res, 11111111111);
      this.init()
      this.onShow(false)
    }
  };

  getCheckedId = (checkedId) => {
    this.dispatch('method:checkedId', checkedId);
  };


  init = async () => {
    this.dispatch('loading:start')
    const { res } = await webapi.queryByStoreId();
    if (res.code === Const.SUCCESS_CODE) {
      let storePaymentVOs = res.context || {};
      // storePaymentVOs = {
      //   onlinePaymentMethodList : [
      //     {
      //       createTime: "2021-03-17 07:04:41.000",
      //       delFlag: 0,
      //       delTime: null,
      //       id: 25,
      //       img_url: 0,
      //       isOpen: 0,
      //       maxAmount: 1001,
      //       name: "visa",
      //       paymentType: 0,
      //       pspId: 1,
      //       storeId: 123457910,
      //       updateTime: "2021-03-23 02:12:36.000"
      //     }
      //   ],
      //   offlinePaymentMethodList: [
      //     {
      //       createTime: "2021-03-17 07:04:41.000",
      //       delFlag: 0,
      //       delTime: null,
      //       id: 28,
      //       img_url: 0,
      //       isOpen: 0,
      //       maxAmount: 0,
      //       name: "cash",
      //       paymentType: 1,
      //       pspId: 1,
      //       storeId: 123457910,
      //       updateTime: null,
      //     }
      //   ],
      //   codPaymentMethodList: [
      //     {
      //       createTime: "2021-03-17 07:04:41.000",
      //       delFlag: 0,
      //       delTime: null,
      //       id: 29,
      //       img_url: 0,
      //       isOpen: 0,
      //       maxAmount: 67865,
      //       name: "cod",
      //       paymentType: 2,
      //       pspId: 1,
      //       storeId: 123457910,
      //       updateTime: "2021-04-02 02:53:08.000"
      //     }
      //   ]
      // }
      this.dispatch('list:storePaymentVOs', storePaymentVOs)
      this.dispatch('loading:end')
    }

    this.dispatch('loading:end')
  }

  onFormChange = ({filed, value}) => {
    this.dispatch('list:paymentForm', { filed, value})
  }

  /**
   * 保存账号名称
   * @param form
   * @returns {Promise<void>}
   */
}
