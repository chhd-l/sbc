import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tool from './components/tool';
import GoodsList from './components/goods-list';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsLibraryImport extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <AuthWrapper functionName="f_goods_import_2">
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>Commodity library import</Breadcrumb.Item>
          </BreadCrumb>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>发布商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品库导入</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline
              title={<FormattedMessage id="commodityLibraryImport" />}
            />
            <Alert
              message={<FormattedMessage id="Instructions" />}
              description={
                <ul>
                  <li>
                    <FormattedMessage id="commodityLibraryImportInfo" />
                  </li>
                </ul>
              }
            />
            {/*搜索*/}
            <SearchForm />

            <Tool />

            {/*商品列表*/}
            <GoodsList />
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
