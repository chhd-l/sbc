import React, { Component } from 'react';
import { Headline, BreadCrumb } from 'qmkit';
import { Breadcrumb } from 'antd';
import PaymentForm from './components/payment-form';

export default class updatePaymentSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Payment Edit</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <PaymentForm />
        </div>
      </div>
    );
  }
}
