import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import FullGiftForm from './components/full_gift_form';
import * as Enum from '../common-components/marketing-enum';
import '../index.less';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingFullGiftAdd extends React.Component<any, any> {
  store: AppStore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { marketingId } = this.props.match.params;
    if (marketingId) {
      this.store.init(marketingId);
    }
    this.store.getAllGroups();
    this.store.initCategory();
    this.store.getAllAttribute();
  }

  render() {
    const WrappedForm = Form.create()(FullGiftForm);
    const { marketingId } = this.props.match.params;
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_gift_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>{marketingId ? 'Edit' : 'Create'}Gift</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container marketing-container">
            <Headline title={marketingId ? 'Edit Gift' : 'Create Gift'} />
            {/*<Alert*/}
            {/*  message="同一商品同一时间可参加不同类型的促销活动，但只可参加一个满赠活动；"*/}
            {/*  type="info"*/}
            {/*  showIcon*/}
            {/*/>*/}

            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                marketingType: Enum.MARKETING_TYPE.FULL_GIFT
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
