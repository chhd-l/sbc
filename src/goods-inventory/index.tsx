import React from 'react';
import { StoreProvider } from 'plume2';
import './inventory.less';
import { Headline, AuthWrapper, BreadCrumb, Const } from 'qmkit';
import AppStore from './store';
import Tab from './components/tab';
import SearchForm from './components/search-form';
import GoodsList from './components/goods-list';
import { FormattedMessage } from 'react-intl';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.onThreshold();
  }

  render() {

    if (Const.SITE_NAME === 'MYVETRECO') {
      return (
        <AuthWrapper functionName="f_goods_1">
          <div>
            <BreadCrumb />
            <div className="container-search">
              <Headline title={<FormattedMessage id="Product.Inventorywarning" />} />
              <SearchForm />
            </div>
            <div className="container">
              <GoodsList />
            </div>
          </div>
        </AuthWrapper>
      );
    }

    return (
      <AuthWrapper functionName="f_goods_1">
        <div>
          <BreadCrumb />
          <div className="container">
            <Tab />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
