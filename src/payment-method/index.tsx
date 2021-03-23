import React from 'react';
import { StoreProvider } from 'plume2';
import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
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
          <div className="container" style={{ height: '100vh' }}>
            <Headline title="Payment method" />
            <MethodList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}