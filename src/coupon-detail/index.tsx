import React, { Component } from 'react';
import { StoreProvider } from 'plume2';

import { Breadcrumb, Tabs } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import Appstore from './store';
import CouponBasicInfo from './components/coupon-basic-info';

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { cid } = this.props.match.params;
    this.store.init(cid);
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>优惠券详情</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title="优惠券" />
          <Tabs>
            <Tabs.TabPane tab="优惠券信息" key="1">
              <CouponBasicInfo />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
