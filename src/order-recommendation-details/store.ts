import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, util, ValidConst } from 'qmkit';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import SettleDetailActor from './actor/settle-detail-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettleDetailActor()];
  }

  init = async (param?: any) => {
    param = Object.assign(this.state().get('sharing').toJS(), param);
    this.dispatch('loading:start');
    const res1 = await webapi.fetchFinanceRewardDetails(param);
    if (res1.res.code === Const.SUCCESS_CODE) {
      param.total = res1.res.context.total;
      //param.total = res1.res.context.total
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('list:init', res1.res.context.content);
      });
    } else {
      message.error(res1.res.message);
      if (res1.res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };
  onProductForm = async (param?: any) => {
    param = Object.assign(this.state().get('sharing').toJS(), param);
    this.dispatch('loading:start');
    const res1 = await webapi.fetchFinanceRewardDetails(param);
    if (res1.res.code === Const.SUCCESS_CODE) {
      param.total = res1.res.context.total;

      //param.total = res1.res.context.total
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('product:productForm', param);
        this.dispatch('product:productList', res1.res.context.content);
      });
    } else {
      message.error(res1.res.message);
      if (res1.res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };

  //Send & Another
  onSharing = (sharing) => {
    this.dispatch('detail:sharing', sharing);
  };
}
