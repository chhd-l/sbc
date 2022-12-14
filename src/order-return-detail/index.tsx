import React from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Headline, BreadCrumb } from 'qmkit';
import { Breadcrumb, Spin } from 'antd';

import OrderStatusHead from './components/order-status-head';
import GoodsList from './components/goods-list';
import ReturnRecord from './components/return-record';
import OperateLog from './components/operate-log';
import { FormattedMessage } from 'react-intl';

/**
 * 退单详情
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class ReturnOrderDetail extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { rid } = this.props.match.params;
    this.store.init(rid);
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
          <Breadcrumb.Item>
            <FormattedMessage id="Order.orderDetails" />
          </Breadcrumb.Item>
        </BreadCrumb>

        <div className="container-search">
          <Headline title={<FormattedMessage id="Order.orderDetails" />} />
        </div>
        <div className="container">
          <OrderStatusHead />
          <GoodsList />
          {/*<ReceiverRecord/>*/}
          <ReturnRecord />
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
