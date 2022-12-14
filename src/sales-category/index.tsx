import React from 'react';
import { Spin, Alert, Form } from 'antd';
import { IOptions, StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import CateList from './component/cate-list';
import CateModal from './component/cate-modal';
import Tool from './component/tool';
import { FormattedMessage } from 'react-intl';
import PicModal from './component/pic-modal';
import ImgModal from './component/img-modal';
import SeoSettingModal from './component/seo-setting-modal';
const _SeoSettingModal = Form.create({})(SeoSettingModal);
import './index.less';
import NewStateModal from '@/address-management/components/new-state-modal';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsCate extends React.Component<any, any> {
  store: AppStore;
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
    this.state = {
      loading: true
    };
  }
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
        {/* this.store.get('loading') */}
        <Spin style={{ position: 'fixed', top: '30%', left: '100px' }} spinning={this.store.get('loading')}>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>店铺分类</Breadcrumb.Item>
        </Breadcrumb> */}

          <div className="container-search">
            <Headline title={<FormattedMessage id="Product.salesCategory" />} />
            <Alert message={<FormattedMessage id="Product.salesCategoryInfo" />} type="info" />

            {/*工具条*/}
            <Tool />
          </div>
          <div className="container">
            {/*列表*/}

            <CateList />

            {/*弹框*/}
            <CateModal />

            <PicModal />
            <ImgModal />

            <_SeoSettingModal />
          </div>
        </Spin>
      </div>
    );
  }
}
