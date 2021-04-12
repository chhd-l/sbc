import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import AppStore from './store';
import FullGiftForm from './components/full-gift-form';
import * as Enum from '../common-components/marketing-enum';
import '../index.less';
const WrappedForm = Form.create()(FullGiftForm);

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
    } else {
      this.store.initDefualtLevelList();
      this.store.setSelectedProductRows({ selectedRows: [], selectedSkuIds: [] })
    }
    this.store.getAllGroups();
    this.store.initCategory();
    this.store.getAllAttribute();
  }

  render() {
    const { marketingId } = this.props.match.params;
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_gift_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>{marketingId ? <FormattedMessage id="Edit gift"/>: <FormattedMessage id="Create gift"/>}</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container marketing-container">
            <Headline title={marketingId ? <FormattedMessage id="Edit gift"/>: <FormattedMessage id="Create gift"/>} />
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
