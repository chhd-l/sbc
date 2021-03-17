import React from 'react';
import { StoreProvider } from 'plume2';
import { AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
//import SearchHead from './components/search-head';
import MethodList from './components/method-list';
import './index.less';

/**
 * 退单列表
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderReturnList extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="rolf001">
        <div className="order-con">
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>订单</Breadcrumb.Item>
            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
            <Breadcrumb.Item>退单列表</Breadcrumb.Item>
          </Breadcrumb> */}
          {/*<div className="container-search">
            <SearchHead />
          </div>*/}
          <div className="container">
            <MethodList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
