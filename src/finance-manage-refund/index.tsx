//资金管理-财务对账-对账详细
import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import RefundList from './components/refund-list';
import RevenueList from './components/revenue-list';
import Foot from './components/foot';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinancialRefund extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { sid } = this.props.match.params;
    const { kind } = this.props.match.params;
    const { beginTime, endTime } = this.props.location.state;
    this.store.init({
      sid: sid,
      kind: kind,
      beginTime: beginTime,
      endTime: endTime
    });
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>资金管理</Breadcrumb.Item>
          <Breadcrumb.Item>财务对账</Breadcrumb.Item>
        </Breadcrumb> */}
        <div>
          {
            this.store.state().get('kind') == 'income' ? (
              <div>
                <div className="container-search">
                  <Headline title={<FormattedMessage id="Finance.RevenueReconciliationDetail" />} />
                  <SearchForm name="Payment method" />
                </div>
                <div className="container">
                  <RevenueList />
                </div>
              </div>
            ) : (
              <div>
                <div className="container-search">
                  <Headline title={<FormattedMessage id="Finance.RefundReconciliationDetail" />} />
                  <SearchForm name="Payment method" />
                </div>
                <div className="container">
                  <RefundList />
                </div>
              </div>
            )

            /*    <Tabs.TabPane tab='收入对账明细' key='1'>
             <SearchForm />


             {/!*收入对账明细*!/}
             <RevenueList />

             </Tabs.TabPane> : <Tabs.TabPane tab='退款对账明细' key='2'>
             <SearchForm />

             {/!*退款对账明细*!/}
             <RefundList />

             </Tabs.TabPane>*/
          }

          <Foot />
        </div>
      </div>
    );
  }
}
