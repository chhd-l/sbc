import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import CateActor from './actor/cate-actor';
import BrandActor from './actor/brand-actor';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import FreightActor from './actor/freight-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import {
  goodsList,
  spuDelete,
  spuOnSale,
  spuOffSale,
  getCateList,
  getBrandList,
  freightList,
  goodsFreight,
  goodsFreightExpress,
  updateFreight
} from './webapi';

import { IList } from 'typings/globalType';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new CateActor(),
      new BrandActor(),
      new GoodsActor(),
      new FormActor(),
      new FreightActor()
    ];
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
   * 条件搜索,回到第一页
   */
  onSearch = async () => {
    this.dispatch('form:field', { key: 'pageNum', value: 0 });
    this.onPageSearch();
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onPageSearch = async () => {
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      likeGoodsInfoNo: this.state().get('likeGoodsInfoNo'),
      likeGoodsNo: this.state().get('likeGoodsNo'),
      pageNum: this.state().get('pageNum'),
      pageSize: this.state().get('pageSize'),
      auditStatus: this.state().get('auditStatus')
    };

    if (this.state().get('storeCateId') != '-1' && this.state().get('storeCateId')) {
      request.storeCateId = this.state().get('storeCateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }
    if (this.state().get('addedFlag') != '-1') {
      request.addedFlag = this.state().get('addedFlag');
    }
    if (this.state().get('saleType') != '-1') {
      request.saleType = this.state().get('saleType');
    }

    const { res, err } = (await goodsList(request)) as any;
    if (!err) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor: init', fromJS(res.context));
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    }
  };

  onStateTabChange = (tabIndex) => {
    this.dispatch('form:field', { key: 'addedFlag', value: tabIndex });
    this.onSearch();
  };

  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  onEditSkuNo = (value) => {
    this.dispatch('goodsActor:editLikeGoodsInfoNo1', value);
  };

  onShowSku = (value) => {
    this.dispatch('goodsActor:editExpandedRowKeys', value);
  };

  onSelectChange = (selectedRowKeys: number[]) => {
    this.dispatch('goodsActor: onSelectChange', fromJS(selectedRowKeys));
  };

  spuDelete = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }
    await spuDelete({ goodsIds: ids });
    this.onSearch();
  };

  spuOnSale = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }

    const data: any = await spuOnSale({ goodsIds: ids });
    this.message(data);
    this.onSearch();
  };

  spuOffSale = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }

    const data: any = await spuOffSale({ goodsIds: ids });
    this.message(data);
    this.onSearch();
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
   * 控制modal显示
   */
  setFeightVisible = (feightVisible: boolean) => {
    this.dispatch('freight:feightVisible', feightVisible);
  };
  /**
   * 运费模板Id收录
   */
  setFreightTempId = (freightTempId: number) => {
    this.dispatch('freight:freightTempId', freightTempId);
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
  /**
   * 单个运费模板首重，续重，发货地数据收录
   */
  setGoodsFreight = async (freightTempId: number, isSelect: boolean) => {
    const { res, err } = await goodsFreight(freightTempId);
    if (!err && res.code === Const.SUCCESS_CODE) {
      if (isSelect) {
        this.dispatch('freight:selectTemp', fromJS(res.context));
        const result = (await goodsFreightExpress(freightTempId)) as any;
        if (result.res.code === Const.SUCCESS_CODE) {
          this.dispatch(
            'freight:selectTempExpress',
            fromJS(result.res.context)
          );
        } else {
          message.error(result.res.message);
        }
      } else {
        this.dispatch('freight:freightTemp', fromJS(res.context));
      }
    } else {
      message.error(res.message);
    }
  };
  /**
   * 批量编辑运费模板数据提交
   */
  submitBatchFreight = async (freightTempId: number) => {
    const goodsIds = this.state().get('selectedSpuKeys');
    let param = {
      goodsIds: goodsIds.toJS(),
      freightTempId: freightTempId
    };
    const { res, err } = (await updateFreight(param)) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      message.success('save successful');
      this.setFeightVisible(false);
      this.setFreightTempId(null);
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    } else {
      message.error(res.message);
    }
  };
}
