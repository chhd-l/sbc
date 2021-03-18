import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import MarketingList from './components/tab-data-grid';
import { FormattedMessage, injectIntl } from 'react-intl';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class Marketing extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.key) {
      this.store.onTabChange(state.key);
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <AuthWrapper functionName="f_marketing_view">
        <div>
          <BreadCrumb />
          {/*导航面包屑*/}
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>营销设置</Breadcrumb.Item>
            <Breadcrumb.Item>促销活动</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Marketing.CampaignList" />} />

            {/*搜索条件*/}
            <SearchForm />
          </div>
          <div className="container">
            {/*tab的客户列表*/}
            <MarketingList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
