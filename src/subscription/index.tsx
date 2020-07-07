import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Breadcrumb } from 'antd';
import './index.less';
import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
import SearchHead from './components/search-head';
import SearchList from './components/search-tab-list';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SubscriptionList extends Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;

    if (state) {
      // state.key? this.store.onTabChange(this.props.location.state.key) : null
      if (state.key) {
        this.store.onTabChange(this.props.location.state.key);
      }
      if (state.payStatus) {
        const params = {
          tradeState: { payState: state.payStatus }
        };
        this.store.onSearch(params);
      }
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <AuthWrapper functionName="fOrderList001">
        <div className="order-con">
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>订单</Breadcrumb.Item>
            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
            <Breadcrumb.Item>订单列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title={<FormattedMessage id="order.orderList" />} />
            <SearchHead />
            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
