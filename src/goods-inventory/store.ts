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
  init = async (pageNum = 0, pageSize = 10, stock = 10) => {
    const param = {
      pageNum,
      pageSize,
      stock
    };

    this.dispatch('loading:start');
    const { res, err } = (await webapi.goodsList(param.pageNum, param.pageSize, param.stock)) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      let result = res.context.goodsInfoPage;
      if (result.content) {
        result.content.forEach((item) => {
          item.goodsInfoImg = item.goodsInfoImg ? item.goodsInfoImg : item.goods.goodsImg ? item.goods.goodsImg : null;
        });
      }
      this.dispatch('list:init', result);
      this.dispatch('current', pageNum + 1);
      this.dispatch('loading:end');
    } else {
      this.dispatch('loading:end');
    }
  };

  onThreshold = async () => {
    const { res, err } = (await webapi.getThreshold()) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.dispatch('goodsActor:stock', res.context.valueEn || 0);
      this.init(0, 10, res.context.valueEn);
    } else {
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
      message.success('Operate successfully');
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
            pageNum: 0,
            pageSize: this.state().get('total'),
            stock: this.state().get('stock'),
            token: token
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref = Const.HOST + `/inventory/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('Please login in');
        }
        resolve();
      }, 500);
    });
  };
}
