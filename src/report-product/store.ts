import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history, util, ValidConst } from 'qmkit';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import reportActor from './actor/report';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new reportActor()];
  }

  init = async (param?: any) => {
    this.dispatch('loading:start');
    const { res } = await webapi.getProductReportPage(param);
    if (res.code === Const.SUCCESS_CODE) {
      //param.total = res1.res.context.total

      this.transaction(() => {
        this.dispatch('product:detailProductList', res.context);
        this.dispatch('product:productselect', arr);
      });
    } else {
      message.error(res.message);
      if (res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };
}
