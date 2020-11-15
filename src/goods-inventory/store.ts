import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import CateActor from './actor/cate-actor';
import BrandActor from './actor/brand-actor';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import FreightActor from './actor/freight-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import { goodsList, getCateList, getBrandList, freightList } from './webapi';

import { IList } from 'typings/globalType';

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
    { pageNum, pageSize, flushSelected } = {
      pageNum: 0,
      pageSize: 10,
      flushSelected: true
    }
  ) => {
    const { res, err } = (await goodsList({
      pageNum,
      pageSize,
      auditStatus: this.state().get('auditStatus')
    })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor: init', fromJS(res.context));
      this.dispatch('form:field', { key: 'pageNum', value: pageNum });
    } else {
      message.error(res.message);
    }

    const cates: any = await getCateList();
    const brands: any = await getBrandList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });

    if (flushSelected) {
      this.dispatch('goodsActor:clearSelectedSpuKeys');
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

  /**
   * 所有运费模板
   */
  setFreightList = async () => {
    const { res, err } = await freightList();
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.dispatch('freight:freightList', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };
}
