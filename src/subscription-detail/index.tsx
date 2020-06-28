import React from 'react';
import { Breadcrumb, Tabs } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';

import OperateLog from './components/operate-log';
import SubscriptionDetailTab from './components/sub-detail';
import OrderDetailTab from './components/order-detail';
import OrderDelivery from './components/order-delivery';
import OrderReceive from './components/order-receive';

import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import './components/detail.less';
/**
 * 订单详情
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class SubscriptionDetail extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { subId } = this.props.match.params;
    if (this.props.location.state != undefined) {
      this.store.onTabsChange(this.props.location.state.tab);
    }
    this.store.init(subId);
  }

  render() {
    const { subId } = this.props.match.params;

    if (this.state.loading) {
      return <div>loading...</div>;
    }

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            {<FormattedMessage id="subscription.detail" />}
          </Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <div className="display-flex">
            <Headline title={<FormattedMessage id="subscription.sub" />} />
            <Headline title={subId} />
          </div>

          <SubscriptionDetailTab />
          {/*<Tabs*/}
          {/*  onChange={(key) => this.store.onTabsChange(key)}*/}
          {/*  activeKey={this.store.state().get('tab')}*/}
          {/*>*/}
          {/*  <Tabs.TabPane tab={<FormattedMessage id="orderDetails" />} key="1">*/}
          {/*    <OrderDetailTab />*/}
          {/*  </Tabs.TabPane>*/}
          {/*  <Tabs.TabPane*/}
          {/*    tab={<FormattedMessage id="deliveryRecord" />}*/}
          {/*    key="2"*/}
          {/*  >*/}
          {/*    <OrderDelivery />*/}
          {/*  </Tabs.TabPane>*/}
          {/*</Tabs>*/}

          {/*<OperateLog />*/}
        </div>
      </div>
    );
  }
}
