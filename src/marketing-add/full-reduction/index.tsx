import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import MarketingAddForm from '../common-components/marketing-add-form';
import * as Enum from '../common-components/marketing-enum';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingFullReductionAdd extends React.Component<
  any,
  any
> {
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
  }

  render() {
    const WrappedForm = Form.create()(MarketingAddForm);
    const { marketingId } = this.props.match.params;
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_reduction_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            {/* <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item> */}
            <Breadcrumb.Item>
              {marketingId ? 'Edit' : 'Create'} full discount activity
            </Breadcrumb.Item>
          </BreadCrumb>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>营销设置</Breadcrumb.Item>
            <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}满减活动
            </Breadcrumb.Item>
          </Breadcrumb> */}

          <div className="container">
            <Headline
              title={
                marketingId
                  ? 'Edit full discount activity'
                  : 'Create full discount activity'
              }
            />
            <Alert
              message="The same product can participate in different types of promotional activities at the same time, but can only participate in one full reduction activity;"
              type="info"
              showIcon
            />

            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                marketingType: Enum.MARKETING_TYPE.FULL_REDUCTION
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
