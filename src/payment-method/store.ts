import { Store, IOptions } from 'plume2';
import ListActor from './actor/list-actor';

import * as webapi from './webapi';
//import { message } from 'antd';
import { Const, cache } from 'qmkit';

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

  onShow = () => {
    this.transaction(() => {
      this.dispatch('modal:show');
    });
  };

  onHide = () => {
    this.dispatch('modal:hide');
  };

  init = async () => {
    let payment = this.state().get('addStorePayment');
    const { res } = await webapi.addStorePayment(payment);

    this.transaction(() => {
      if (res.code === Const.SUCCESS_CODE) {
        this.dispatch('Payment:addStorePayment', res.context.logVOList);
      }
    });
  };

  /**
   * 保存账号名称
   * @param form
   * @returns {Promise<void>}
   */
}
