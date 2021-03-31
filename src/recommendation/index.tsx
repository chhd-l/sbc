import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Breadcrumb } from 'antd';
import './index.less';
import { AuthWrapper, BreadCrumb, history } from 'qmkit';
import SearchHead from './components/search-head';
import SearchList from './components/search-tab-list';
import config from '../qmkit/config';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderList extends Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
    this.state = {};
  }

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
      // <AuthWrapper
      //   functionName={
      //     history.location.pathname == '/recomm-page'
      //       ? 'Recommendationlist'
      //       : 'Recommendationlist_prescriber'
      //   }
      // >
        <div className="order-con">
          <BreadCrumb />
          <div className="container-search">
            <SearchHead />
          </div>
          <div className="container">
            <SearchList />
          </div>
        </div>
      // </AuthWrapper>
    );
  }
}
