import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import CateList from './component/cate-list';
import CateModal from './component/cate-modal';
import Tool from './component/tool';
import { FormattedMessage } from 'react-intl';
import PicModal from './component/pic-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsCate extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
    //初始化素材
    this.store.initImg({
      pageNum: 0,
      cateId: -1,
      successCount: 0
    });
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>店铺分类</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container-search">
          <Headline title={<FormattedMessage id="Product.storeCategory" />} />
          <Alert message={<FormattedMessage id="Product.storeCategoryInfo" />} type="info" />

          {/*工具条*/}
          <Tool />
        </div>
        <div className="container">
          {/*列表*/}
          <CateList />

          {/*弹框*/}
          <CateModal />

          <PicModal />
        </div>
      </div>
    );
  }
}
