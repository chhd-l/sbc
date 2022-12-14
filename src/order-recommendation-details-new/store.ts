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
    this.dispatch('loading:start');
    const res1 = await webapi.fetchFindById(param);
    let arr = [];
    if (res1.res.code === Const.SUCCESS_CODE) {
      param.total = res1.res.context.total;
      //param.total = res1.res.context.total
      res1.res.context.recommendationGoodsInfoRels.map((v, i) => {
        arr.push(v.goodsInfo);
      });
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('product:detailProductList', res1.res.context);
        this.dispatch('product:productselect', arr);
      });
    } else {
      this.dispatch('loading:end');
    }
  };
  onProductForm = async (param?: any) => {
    param = Object.assign(this.state().get('onProductForm').toJS(), param);
    this.dispatch('loading:start');
    const res1 = await webapi.fetchproductTooltip(param);
    if (res1.res.code === Const.SUCCESS_CODE) {
      param.total = res1.res.context.goodsInfos.total;
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('product:productForm', param);
        this.dispatch('productList:productInit', res1.res.context.goodsInfos.content);
      });
    } else {
      this.dispatch('loading:end');
    }
  };

  onSearchParams = (searchParams) => {
    this.dispatch('product:searchParams', searchParams);
  };

  //productselect
  onProductselect = (addProduct) => {
    localStorage.removeItem('productselect');
    if (Array.isArray(addProduct) && addProduct.length > 0) {
      let arr = addProduct.map((v, i) => {
        return {
          goodsInfoId: v.goodsInfoId,
          recommendationNumber: v.recommendationNumber ? v.recommendationNumber : 1
        };
      });
      this.onCreateLink({
        field: 'recommendationGoodsInfoRels',
        value: arr
      });
      localStorage.setItem('productselect', String(addProduct.length));
    }

    this.dispatch('product:productselect', addProduct);
  };

  //Create Link
  onCreateLink = (Link) => {
    this.dispatch('create:createLink', Link);
  };

  //Get Link
  onCreate = async (param?: any) => {
    const res = await webapi.fetchCreateLink(param);
    this.dispatch('get:getLink', res.res.context);
  };
  //

  //Send & Another
  onSharing = (sharing) => {
    this.dispatch('detail:sharing', sharing);
  };

  //Send
  onSend = async (type, param?: any) => {
    const res = await webapi.fetchModify(param);
    if (res.res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({id:'Order.sendSuccessfully'}));
      if (type == 'send') {
        history.goBack();
      } else {
        this.dispatch('get:send', true);
      }
    } else {
      if (res.res.code === 'K-110001') {
        message.success(RCi18n({id:'Order.sendFailed'}));
        return false;
      }
    }
  };

  //LinkStatus

  onLinkStatus = async (param?: any) => {
    const res = await webapi.fetchLinkStatus(param);
    if (res.res.code === Const.SUCCESS_CODE) {
      //message.success('switch successfully!');
      this.dispatch('get:linkStatus', res.res.context);
    } else {
      if (res.res.code === 'K-110001') {
        message.success(RCi18n({id:'Order.switchFailed'}));
        return false;
      }
    }
  };
}
