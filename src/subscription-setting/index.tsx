import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Switch, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
export default class SubscriptionSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Subscription setting'
    };
  }
  componentDidMount() {}
  render() {
    const { title } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
        </div>
      </div>
    );
  }
}
