//财务-资金管理-订单开票
import React from 'react';
//import { Breadcrumb } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';

import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import DetailsList from './components/list';
import OrderInvoiceAddModal from './components/order-invoice-modal';
import OrderInvoiceViewModal from './components/order-invoice-view-modal';

import { StoreProvider } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceOrderReceive extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;

    if (state) {
      if (state.invoiceState) {
        this.store.onFormChange({
          field: 'invoiceState',
          value: state.invoiceState
        });
        this.store.onSearch();
      }
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <AuthWrapper functionName="financeRewardQuery">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>财务</Breadcrumb.Item>
            <Breadcrumb.Item>开票管理</Breadcrumb.Item>
            <Breadcrumb.Item>订单开票</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Reward" />} />
            <SearchForm />
            <AuthWrapper functionName={'financeRewardExport'}>
              <div style={{ paddingBottom: '16px' }}>
                <Button onClick={() => this.store.bulkExport()}>
                  {<FormattedMessage id="bulkExport" />}
                </Button>
              </div>
            </AuthWrapper>
          </div>
          {/*<ButtonGroup />*/}
          <div className="container">
            <DetailsList />
            <OrderInvoiceAddModal />
            <OrderInvoiceViewModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
