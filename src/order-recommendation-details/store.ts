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
    param = Object.assign(this.state().get('onProductForm').toJS(), param);
    this.dispatch('loading:start');
    const res1 = await webapi.fetchproductTooltip(param);
    if (res1.res.code === Const.SUCCESS_CODE) {
      param.total = res1.res.context.goodsInfoPage.total;
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('product:productForm', param);
        this.dispatch(
          'productList:productInit',
          res1.res.context.goodsInfoPage.content
        );
      });
    } else {
      message.error(res1.res.message);
      if (res1.res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };

  //productselect
  onProductselect = (addProduct) => {
    this.dispatch('product:productselect', addProduct);
  };

  //Create Link
  onCreateLink = (Link) => {
    this.dispatch('create:createLink', Link);
  };
  onCreate = async (param?: any) => {
    const res = await webapi.fetchCreateLink(param);
    console.log(param);
  };

  //Send & Another
  onSharing = (sharing) => {
    this.dispatch('detail:sharing', sharing);
  };
}
