import React from 'react';
import { Breadcrumb, Tabs, Spin, Button } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import OperateLog from './components/operate-log';
import OrderDetailTab from './components/order-detail';
import Fulfillment from './components/order-fulfillment';
import OrderReceive from './components/order-receive';
import Comment from './components/comment';
import { Headline } from 'qmkit';
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
    const detail = this.store.state().get('detail');
    if (this.state.loading) {
      return (
        <div style={styles.noBackgroundContainer}>
          <Spin spinning={this.state.loading}/>
        </div>
      );
    }

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/order-list">
              <FormattedMessage id="Menu.Order" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/order-list">
              <FormattedMessage id="Menu.Order list" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/service-order" className="service_order_detail_bread">
              <FormattedMessage id="Menu.Service Order" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{<FormattedMessage id="Order.OrderDetails" />}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container-search">
          <Headline title={<FormattedMessage id="Order.OrderDetails" />} />
        </div>
        {detail.size > 0 ? (
          <div className="container service_order_detail">
            <Tabs
              onChange={(key) => this.store.onTabsChange(key)}
              activeKey={this.store.state().get('tab')}
            >
              <Tabs.TabPane tab={<FormattedMessage id="Order.OrderDetails" />} key="1">
                <OrderDetailTab />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<FormattedMessage id="Order.Fulfillment" />} key="2">
                <Fulfillment />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<FormattedMessage id="Order.PaymentRecords" />} key="3">
                <OrderReceive />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<FormattedMessage id="Order.Comment" />} key="4">
                <Comment orderNumber={tid} petOwnerName={detail.getIn(['buyer', 'name'])} />
              </Tabs.TabPane>
            </Tabs>
            {this.store.state().get('tab') !== '2' ? <OperateLog /> : null}
          </div>
        ) : (
          <div
            className="container"
            style={{
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            operation failure
          </div>
        )}

        <div className="bar-button">
          <Button onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="Order.Back" />}
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
