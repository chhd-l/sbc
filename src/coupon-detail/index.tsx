import React, { Component } from 'react';
import { StoreProvider } from 'plume2';

import { Breadcrumb, Tabs } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import Appstore from './store';
import CouponBasicInfo from './components/coupon-basic-info';
import ActivitiesInfo from './components/ActivitiesInfo';
import './index.less'
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
          <Breadcrumb.Item>
            <FormattedMessage id="Marketing.CouponDetail" />
          </Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title={<FormattedMessage id="Marketing.Coupon" />} />
          <Tabs defaultActiveKey={this.props.match.params.key}>
            <Tabs.TabPane tab={<FormattedMessage id="Marketing.CouponInfo" />} key="1">
              <CouponBasicInfo />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<FormattedMessage id="Marketing.ActivitiesInfo" />} key="2">
              <ActivitiesInfo couponId={this.props.match.params.cid}/>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
