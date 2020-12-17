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
 * 积分订单详情
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
          <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}></Spin>
        </div>
      );
    }

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            <FormattedMessage id="PointsOrderDetails"></FormattedMessage>
          </Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title={<FormattedMessage id="PointsOrderDetails"></FormattedMessage>} />

          <Tabs onChange={(key) => this.store.onTabsChange(key)} activeKey={this.store.state().get('tab')}>
            <Tabs.TabPane tab="订单详情" key="1">
              <OrderDetailTab />
            </Tabs.TabPane>
            <Tabs.TabPane tab="发货记录" key="2">
              <OrderDelivery />
            </Tabs.TabPane>
            <Tabs.TabPane tab="收款记录" key="3">
              <OrderReceive />
            </Tabs.TabPane>
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
