import { Store, IOptions } from 'plume2';
//import { fromJS } from 'immutable';
import GoodsActor from './actor/goods-actor';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import * as webapi from './webapi';

//import { IList } from 'typings/globalType';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new GoodsActor()];
  }

  /**
   * 初始化
   */
  init = async (pageNum, pageSize, stock) => {
    console.log(pageNum, 1111111111);
    console.log(pageSize, 222222222222);
    console.log(stock, 333333333333);
    let param = {
      pageNum: 0,
      pageSize: 10,
      stock: 10
    };
    if (!pageNum && !pageSize && !stock) {
      param = {
        pageNum: pageNum,
        pageSize: pageSize,
        stock: stock
      };
    }
    this.dispatch('loading:start');
    const { res, err } = (await webapi.goodsList(param.pageNum, param.pageSize, param.stock)) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.dispatch('list:init', res.context.goodsInfoPage);
      this.dispatch('current', pageNum + 1);
      this.dispatch('loading:end');
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  onThreshold = async () => {
    const { res, err } = await webapi.getThreshold();
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.dispatch('goodsActor:getThreshold', res.context.valueEn);
    } else {
      message.error(res.message);
    }
  };

  onStock = (res) => {
    this.dispatch('goodsActor:stock', res);
  };

  /**
   * tip
   */
  message = (data: any) => {
    if (data.res.code === Const.SUCCESS_CODE) {
      message.success('save successful');
    } else {
      message.error(data.res.code);
    }
  };

  //导出
  bulkExport = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            pageNum: this.state().get('current'),
            pageSize: this.state().get('pageSize'),
            stock: this.state().get('stock'),
            token: token
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref = Const.HOST + `/inventory/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
  };
}
