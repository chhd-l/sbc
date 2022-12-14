import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
// import Tool from './components/tool';
import Tab from './components/tab';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsCheck extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    if (state) {
      this.store.onStateTabChange(state.key);
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <AuthWrapper functionName="f_goods_check_1">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>待审核商品</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Product.pendingProducts" />} />

            {/*搜索*/}
            <SearchForm />
          </div>
          <div className="container">
            {/*工具条*/}
            {/* <Tool /> */}

            {/*tab页显示商品列表*/}
            <Tab />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
