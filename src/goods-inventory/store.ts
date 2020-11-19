import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import CateActor from './actor/cate-actor';
import BrandActor from './actor/brand-actor';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import FreightActor from './actor/freight-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
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
    return [new CateActor(), new BrandActor(), new GoodsActor(), new FormActor(), new FreightActor()];
  }

  /**
   * 初始化
   */
  init = async (
    { pageNum, pageSize } = {
      pageNum: 0,
      pageSize: 10
    }
  ) => {
    let stock = 11;
    console.log(pageSize, 111111);
    const getThreshold = await webapi.getThreshold();
    const { res, err } = (await webapi.goodsList(pageNum, pageSize, stock)) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor:getThreshold', getThreshold.context);
      this.dispatch('goodsActor: init', fromJS(res.context));
      this.dispatch('form:field', { key: 'pageNum', value: pageNum });
    } else {
      message.error(res.message);
    }
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
}
