//资金管理-财务对账
import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Tabs, Button } from 'antd';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import RefundList from './components/refund-list';
import RevenueList from './components/revenue-list';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinancialAccounts extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    if (this.props.location.state) {
      const { kind } = this.props.location.state;
      //重置各项参数
      this.store.setParams(kind);
    }
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_finance_manage_check">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>财务</Breadcrumb.Item>
            <Breadcrumb.Item>资金管理</Breadcrumb.Item>
            <Breadcrumb.Item>财务对账</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Finance.FinanceReconciliation" />} />
            <SearchForm />
            {/*<AuthWrapper functionName="f_check_export">
              <div style={{ paddingBottom: '16px' }}>
                <Button onClick={() => this.store.bulk_export()}>
                  {<FormattedMessage id="bulkExport" />}
                </Button>
              </div>
            </AuthWrapper>*/}
          </div>
          <div className="container">
            <Tabs onChange={(key) => this.store.onTabChange(key)} activeKey={this.store.state().get('tabKey')}>
              <Tabs.TabPane tab={<FormattedMessage id="Finance.revenueReconciliation" />} key="1">
                {/*收入对账*/}
                <RevenueList />
              </Tabs.TabPane>

              <Tabs.TabPane tab={<FormattedMessage id="Finance.refundReconciliation" />} key="2">
                {/*退款对账*/}
                <RefundList />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
