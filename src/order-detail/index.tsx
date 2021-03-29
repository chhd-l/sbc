import React from 'react';
import { Breadcrumb, Tabs, Spin, Button } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';

import OperateLog from './components/operate-log';
import OrderDetailTab from './components/order-detail';
import OrderDelivery from './components/order-delivery';
import OrderReceive from './components/order-receive';
import Comment from './components/comment';

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
    const { tid } = this.props.match.params;
    if (this.state.loading) {
      return (
        <div style={styles.noBackgroundContainer}>
          <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}></Spin>
        </div>
      );
    }

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/order-list">Order</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/order-list">Order list</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{<FormattedMessage id="orderDetails" />}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container-search">
          <Headline title={<FormattedMessage id="orderDetails" />} />
        </div>
        <div className="container">
          <Tabs onChange={(key) => this.store.onTabsChange(key)} activeKey={this.store.state().get('tab')}>
            <Tabs.TabPane tab={<FormattedMessage id="orderDetails" />} key="1">
              <OrderDetailTab />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<FormattedMessage id="deliveryRecord" />} key="2">
              <OrderDelivery />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<FormattedMessage id="collectionRecords" />} key="3">
              <OrderReceive />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Comment" key="4">
              <Comment orderNumber={tid} petOwnerName={this.store.state().get('detail').getIn(['buyer', 'name'])} />
            </Tabs.TabPane>
          </Tabs>
          
          <OperateLog />
        </div>
        <div className="bar-button">
          <Button onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
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
