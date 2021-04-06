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
          <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}></Spin>
        </div>
      );
    }
    
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            <FormattedMessage id="refundDetails" />
          </Breadcrumb.Item>
        </BreadCrumb>

        <div className="container-search">
          <Headline title={<FormattedMessage id="refundDetails" />} />
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
