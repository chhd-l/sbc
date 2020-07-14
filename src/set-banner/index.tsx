import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import './index.less';
import { AuthWrapper, BreadCrumb } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SubscriptionList extends Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
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
          <div className="container">ssssssssssss</div>
        </div>
      </AuthWrapper>
    );
  }
}
