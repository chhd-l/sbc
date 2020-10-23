import * as React from 'react';
import { IOptions, StoreProvider } from 'plume2';
import { Breadcrumb, Tabs } from 'antd';
import { Const, Headline, history, checkAuth, BreadCrumb } from 'qmkit';
import AppStore from './store';
import Goods from './component/goods';
import RelatedProduct from './related-product';
import GoodsPropDetail from './component/goodsPropDetail';
import Spec from './component/spec';
import SkuTable from './component/sku-table';
import Price from './component/price';
import Detail from './component/detail';
import Foot from './component/foot';
import BrandModal from './component/brand-modal';
import CateModal from './component/cate-modal';
import PicModal from './component/pic-modal';
import ImgModal from './component/img-modal';
import Logistics from './component/logistics';
import VideoModal from './component/video-modal';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsAdd extends React.Component<any, any> {
  store: AppStore;
  constructor(props: IOptions) {
    super(props);
    this.state = {
      tabType: ''
    };
  }

  componentDidMount() {
    const { gid } = this.props.match.params;
    this.store.init(gid);
    this.store.setFreightList();
    //初始化素材
    this.store.initImg({
      pageNum: 0,
      cateId: -1,
      successCount: 0
    });
    this.store.initVideo({
      pageNum: 0,
      cateId: -1,
      successCount: 0
    }); //传入-1时,则会去初始化第一个分类的信息
    if (this.props.location.state != undefined) {
      this.store.onMainTabChange(this.props.location.state.tab, false);
    }
  }
  onMainTabChange = (res) => {
    this.setState({
      tabType: res
    });
  };
  render() {
    const { gid } = this.props.match.params;
    //默认添加商品的编辑与设价权限
    let goodsFuncName = 'f_goods_add_1';
    let priceFuncName = 'f_goods_add_2';
    if (gid) {
      //编辑
      if (this.props.location.pathname.indexOf('/goods-check-edit') > -1) {
        //待审核商品编辑,设价
        goodsFuncName = 'f_goods_sku_edit';
        priceFuncName = 'f_goods_sku_price';
      } else {
        //已审核商品编辑,设价
        goodsFuncName = 'f_goods_sku_edit_2';
        priceFuncName = 'f_goods_sku_edit_3';
      }
    }

    const path = this.props.match.path || '';
    const parentPath = path.indexOf('/goods-check-edit/') > -1 ? '待审核商品' : '商品列表';
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{gid ? <FormattedMessage id="product.editProduct" /> : <FormattedMessage id="newProduct" />}</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>{gid ? parentPath : '发布商品'}</Breadcrumb.Item>
          <Breadcrumb.Item>{gid ? '编辑商品' : '新增商品'}</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container-search">
          <Headline title={gid ? <FormattedMessage id="product.editProduct" /> : <FormattedMessage id="newProduct" />} state={this._getState(gid)} />
        </div>
        <div className="container">
          <Tabs
            /*activeKey={this.store.state().get('activeTabKey')}
            onChange={(activeKey) => this.store.onMainTabChange(activeKey)}*/
            defaultActiveKey="related"
            onChange={(activeKey) => this.onMainTabChange(activeKey)}
          >
            {(checkAuth(goodsFuncName) || checkAuth(priceFuncName)) && (
              <Tabs.TabPane tab={<FormattedMessage id="product.basicInformation" />} key="main">
                {/*商品基本信息*/}
                <Goods />
                {/*商品属性信息*/}
                <GoodsPropDetail />

                {/*商品规格信息*/}
                <Spec />

                {/*商品表格*/}
                <SkuTable />

                {/*物流表单*/}
                <Logistics />

                {/*详情*/}
                <Detail />
              </Tabs.TabPane>
            )}
            <Tabs.TabPane
              tab="Related product"
              key="related"
              // disabled={!this.store.state().getIn(['goods', 'goodsId'])}
            >
              <RelatedProduct />
            </Tabs.TabPane>
          </Tabs>

          {/*页脚*/}
          {this.state.tabType != 'related' ? <Foot goodsFuncName={goodsFuncName} priceFuncName={priceFuncName} /> : null}

          {/*品牌*/}
          <BrandModal />

          {/*分类*/}
          <CateModal />

          {/*图片库*/}
          <PicModal />

          <ImgModal />

          {/*视频库*/}
          <VideoModal />
        </div>
      </div>
    );
  }

  /**
   * 展示商品状态
   * @param gid
   * @returns {any}
   * @private
   */
  _getState(gid) {
    // 已保存的才有这种状态
    if (gid) {
      const auditStatus = this.store.state().getIn(['goods', 'auditStatus']);
      // 待审核的不能修改
      if (auditStatus == 0) {
        history.goBack();
      }
      return Const.goodsState[auditStatus];
    }

    return null;
  }
}
