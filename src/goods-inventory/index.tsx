import React from 'react';
import { StoreProvider } from 'plume2';
import './inventory.less';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
//import Tab from './components/tab';
//import { FormattedMessage } from 'react-intl';
import GoodsList from '@/goods-inventory/components/goods-list';
import { FormattedMessage } from 'react-intl';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.onThreshold();
  }

  render() {
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
}
