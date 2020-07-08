import React from 'react';
import { Breadcrumb, Tabs, Card } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';

import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import './index.less';
/**
 * 订单详情
 */
export default class SubscriptionDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const cartTitle = (
      <div className="cart-title">
        <span>Subscription</span>
        <span>#1</span>
      </div>
    );

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            {<FormattedMessage id="subscription.detail" />}
          </Breadcrumb.Item>
        </BreadCrumb>
        <Card title={cartTitle} bordered={false} style={{ margin: 20 }}>
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </div>
    );
  }
}
