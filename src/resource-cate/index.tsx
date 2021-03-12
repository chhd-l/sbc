import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import CateList from './component/cate-list';
import CateModal from './component/cate-modal';
import Tool from './component/tool';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ResourceCate extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_resourceCate_0">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>素材管理</Breadcrumb.Item>
            <Breadcrumb.Item>素材分类</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Setting.assetCategory" />} />
            <Alert message={<FormattedMessage id="Setting.assetCategoryInfo" />} type="info" showIcon />
            {/*工具条*/}
            <Tool />
          </div>
          <div className="container">
            {/*列表*/}
            <CateList />

            {/*弹框*/}
            <CateModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
