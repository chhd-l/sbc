//资金管理-财务结算
import React from 'react';
import { Breadcrumb, Button } from 'antd';

import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchForm from './components/search-form';
import TabList from './components/tab-list';
import ButtonGroup from './components/button-group';
import { FormattedMessage, injectIntl } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
class FinancialSettlement extends React.Component<any, any> {
  store: AppStore;
  constructor(props) {
    super(props);
  }
  props: {
    intl: any;
  };
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
            <Headline title={<FormattedMessage id="Finance.financialSettlement" />} smallTitle={RCi18n({ id: 'Finance.YourSettlementDate' }) + `${this.store.state().get('accountDay')}` + RCi18n({ id: 'Finance.EachMonth' })} />

            <SearchForm />

            {/*<AuthWrapper functionName="f_settle_export">s
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
export default injectIntl(FinancialSettlement);
