//资金管理-财务结算
import React from 'react';
import { Breadcrumb, Button } from 'antd';

import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchForm from './components/search-form';
import TabList from './components/tab-list';
import ButtonGroup from './components/button-group';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinancialSettlement extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_finance_manage_settle">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>财务</Breadcrumb.Item>
            <Breadcrumb.Item>资金管理</Breadcrumb.Item>
            <Breadcrumb.Item>财务结算</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline
              title={<FormattedMessage id="FinanceManagesettle.financialSettlement" />}
              smallTitle={`Your settlement date is ${this.store.state().get('accountDay')}th of each month, when the month does not include the set date, it will be postponed to the next settlement date`}
            />

            <SearchForm />

            {/*<AuthWrapper functionName="f_settle_export">
              <div style={{ paddingBottom: '16px' }}>
                <Button onClick={() => this.store.bulkExport()}>
                  {<FormattedMessage id="bulkExport" />}
                </Button>
              </div>
            </AuthWrapper>*/}
            <ButtonGroup />
          </div>
          <div className="container">
            {/*财务结算表格*/}
            <TabList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
