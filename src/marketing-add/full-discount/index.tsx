import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb, Const } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppStore from './store';
import FullDiscountForm from './components/full-discount-form';
import * as Enum from '../common-components/marketing-enum';
import '../index.less';
const WrappedForm = Form.create()(FullDiscountForm);

import * as webapi from '@/marketing-add/webapi';
import { fromJS } from 'immutable';
@StoreProvider(AppStore, { debug: __DEV__ })
class MarketingFullDiscountAdd extends React.Component<any, any> {
  store: AppStore;
  _form;
  props: {
    intl: any;
    match: any;
  }
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

    return (
      <AuthWrapper functionName="f_marketing_discount_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            {/* <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item> */}
            <Breadcrumb.Item>{marketingId ? <FormattedMessage id="Marketing.Editdiscountactivity" /> : <FormattedMessage id="Marketing.Creatediscountactivity" />}</Breadcrumb.Item>
          </BreadCrumb>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>营销设置</Breadcrumb.Item>
            <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}满折活动
            </Breadcrumb.Item>
          </Breadcrumb> */}

          <div className="container-search marketing-container">
            <Headline title={
              marketingId ?
              this.props.intl.formatMessage({
                id: 'Marketing.Editdiscountactivity'
              })
              :
                this.props.intl.formatMessage({
                  id: 'Marketing.Creatediscountactivity'
                })
            }
            />
            <Alert message={
              this.props.intl.formatMessage({
                id: 'Marketing.discountTip'
              })
            } type="info" showIcon />

            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                marketingType: Enum.MARKETING_TYPE.FULL_DISCOUNT
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}

export default injectIntl(MarketingFullDiscountAdd)
