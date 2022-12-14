import React from 'react';
import { Breadcrumb, Tabs, Spin } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';

import OperateLog from './components/operate-log';
import OrderDetailTab from './components/order-detail';
import OrderDelivery from './components/order-delivery';
import OrderReceive from './components/order-receive';

import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';

/**
 * 订单详情
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderDetail extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { tid } = this.props.match.params;
    if (this.props.location.state != undefined) {
      this.store.onTabsChange(this.props.location.state.tab);
    }
    this.store.init(tid);
  }

  render() {
    if (this.state.loading) {
      return (
        <div style={styles.noBackgroundContainer}>
          <Spin spinning={this.state.loading}></Spin>
        </div>
      );
    }

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{<FormattedMessage id="Order.OrderDetails" />}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Order.OrderDetails" />} />
        </div>
        <div className="container">
          <Tabs onChange={(key) => this.store.onTabsChange(key)} activeKey={this.store.state().get('tab')}>
            <Tabs.TabPane tab={<FormattedMessage id="Order.OrderDetails" />} key="1">
              <OrderDetailTab />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<FormattedMessage id="Order.DeliveryRecord" />} key="2">
              <OrderDelivery />
            </Tabs.TabPane>
            {/* <Tabs.TabPane
              tab={<FormattedMessage id="collectionRecords" />}
              key="3"
            >
              <OrderReceive />
            </Tabs.TabPane> */}
          </Tabs>

          <OperateLog />
        </div>
      </div>
    );
  }
}
const styles = {
  noBackgroundContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  } as any
};
