import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { AuthWrapper, Headline, Tips, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tab from './components/tab';
import EvaluateSum from './components/store-evaluate-sum';
import SeeRecord from './components/see-record';
import See from './components/see';
import { FormattedMessage } from 'react-intl';
// import { Link } from 'react-router-dom';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  /**
   * 显示服务评价弹框
   */
  _showCateModal = () => {
    this.store.serviceModal(true);
    this.store.initStoreEvaluate();
  };
  initData() {
    this.store.init();
  }
  render() {
    return (
      <AuthWrapper functionName="f_customer_0">
        <div>
          <BreadCrumb />
          {/*导航面包屑*/}
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>评价管理</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search customer">
            <Headline title={<FormattedMessage id="Product.reviewManagement" />} />
            <EvaluateSum />
            <br />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tips title={<FormattedMessage id="Product.reviewTip" />} />
              {/*权限*/}
              <AuthWrapper functionName="f_goods_detail_1">
                <span
                  style={{
                    color: 'var(--primary-color)',
                    cursor: 'pointer',
                    marginLeft: '20px'
                  }}
                  onClick={this._showCateModal}
                >
                  <FormattedMessage id="Product.ratingRule" />
                </span>
              </AuthWrapper>
            </div>
            <br />
            {/*搜索条件*/}
            <SearchForm />
          </div>
          <div className="container">
            {/*tab的评价列表*/}
            <Tab />
            <SeeRecord />
            <See />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
