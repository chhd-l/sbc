import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import FirstDiscountForm from './components/first-discount-form';
import * as Enum from '../common-components/marketing-enum';
import '../index.less';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingFirstOrderAdd extends React.Component<any, any> {
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
  }

  render() {
    const WrappedForm = Form.create()(FirstDiscountForm);
    const state = this.props.location.state;
    const { marketingId } = this.props.match.params;
    const { source } = (state || {}) as any;

    return (
      <AuthWrapper functionName="f_marketing_discount_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>{marketingId ? 'Edit' : 'Create'} first order discount</Breadcrumb.Item>
          </BreadCrumb>

          <div className="container-search marketing-container">
            <Headline title={marketingId ? 'Edit first order discount' : 'Create first order discount'} />
            <Alert message="The same product can participate in different types of promotional activities at the same time, but can only participate in one full discount activity;" type="info" showIcon />

            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                marketingType: Enum.MARKETING_TYPE.FIRST_DISCOUNT
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
