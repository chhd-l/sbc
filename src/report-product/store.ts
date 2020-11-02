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

  onProductStatistics = async (param?: any) => {
    this.dispatch('loading:start');
    const { res } = await webapi.getProductStatistics(param);
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('report:productStatistics', res.context);
      });
    } else {
      message.error(res.message);
      if (res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };

  onProductReportPage = async (param?: any) => {
    this.dispatch('loading:start');
    const { res } = await webapi.getProductReportPage(param);
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('report:productReportPage', res.context);
        this.dispatch('current', param && param.pageNum + 1);
      });
    } else {
      message.error(res.message);
      if (res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };
}
