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
      this.dispatch('loading:end');
    }
  };

  onProductReportPage = async (param?: any) => {
    this.dispatch('loading:start');
    const { res } = await webapi.getProductReportPage(param);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('loading:end');
      this.dispatch('report:productReportPage', res.context);
      this.dispatch('current', param && param.pageNum + 1);
      this.dispatch('report:getDate', { beginDate: param.beginDate, endDate: param.endDate });
      this.dispatch('report:getForm', param);
    } else {
      message.error(res.message);
      this.dispatch('loading:end');
    }
  };

  handleBatchExport = async () => {
    const queryParams = this.state().get('getForm');
    const { beginDate, endDate, skuCode } = queryParams;
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            beginDate: beginDate,
            endDate: endDate,
            skuCode: skuCode,
            sortName: 'revenue',
            token: token
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref = Const.HOST + `/digitalStrategy/productReportPage/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
  };
}
