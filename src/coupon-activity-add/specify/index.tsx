import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Alert, Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import Appstore from './store';
import SpecifyAddForm from './components/add-form';

const WrappedForm = Form.create()(SpecifyAddForm);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { activityId } = this.props.match.params;
    this.store.init(activityId);
  }

  render() {
    const id = this.store.state().getIn(['activity', 'activityId']);
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return [
      <BreadCrumb thirdLevel={true}>
        {/* <Breadcrumb.Item>
          {source == 'marketCenter' ? '营销中心' : '优惠券活动'}
        </Breadcrumb.Item> */}
        <Breadcrumb.Item>{id ? 'Edit ' : 'Create '}coupon activity</Breadcrumb.Item>
      </BreadCrumb>,
      // <Breadcrumb separator=">" key="Breadcrumb">
      //   <Breadcrumb.Item>营销</Breadcrumb.Item>
      //   <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
      //   <Breadcrumb.Item>
      //     {source == 'marketCenter' ? '营销中心' : '优惠券活动'}
      //   </Breadcrumb.Item>
      //   <Breadcrumb.Item>{id ? '编辑' : '创建'}精准发券活动</Breadcrumb.Item>
      // </Breadcrumb>,
      <div className="container" key="container">
        <Headline title={id ? 'Create coupon activity' : 'Create coupon activity'} />
        <Alert
          message={
            <div>
              <p>Instructions</p>
              <p>During the activity valid coupons can be displayed on the front end. Customers can collect them at the coupon center, the activity page or product details page.</p>
              <p>Each customer can only collect one coupon at a time, and each order can only use one coupon, which can be collected again after use;</p>
            </div>
          }
          type="info"
        />
        <WrappedForm ref={(form) => (this._form = form)} />
      </div>
    ];
  }
}
