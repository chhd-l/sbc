import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb, RCi18n } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppStore from './store';
import FullReductionForm from './components/full-reduction-form';
import * as Enum from '../common-components/marketing-enum';
import '../index.less';
import FreeShipingForm from '@/marketing-add/common-components/free-shipping-add-form';
const WrappedForm = Form.create()(FullReductionForm);
const WrappedShippingForm = Form.create()(FreeShipingForm);
@StoreProvider(AppStore, { debug: __DEV__ })
class MarketingFullReductionAdd extends React.Component<any, any> {
  store: AppStore;
  _form;
  props: {
    intl: any;
    match;
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { marketingType, marketingId } = this.props.match && this.props.match.params ? this.props.match.params : null;
    debugger
    if (marketingId) {
      if( !marketingType) {
        this.store.init(marketingId);
      } else {
        this.store.initShipping(marketingId);
      }
    } else {
      this.store.initReductionDefualtLevelList();
      this.store.setSelectedProductRows({ selectedRows: [], selectedSkuIds: [] })
    }
    this.store.getAllGroups();
    this.store.initCategory();
    this.store.getAllAttribute();
  }

  render() {
    const { marketingId } = this.props.match && this.props.match.params ? this.props.match.params : null;
    // const state = this.props.location.state;
    // const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_reduction_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            {/* <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item> */}
            <Breadcrumb.Item>{marketingId ?<FormattedMessage id="Marketing.Editreductionactivity" /> :
              <FormattedMessage id="Marketing.Createreductionactivity" />
             } </Breadcrumb.Item>
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

          <div className="container-search marketing-container" style={{ paddingBottom: 20 }}>
            <Headline title={marketingId ? (window as any).RCi18n({
              id: 'Marketing.Editreductionactivity'
            }):
              (window as any).RCi18n({
              id: 'Marketing.Createreductionactivity'
            })
            } />
            <Alert message={
              (window as any).RCi18n({
                id: 'Marketing.reductionTip'
              })
            } type="info" showIcon />


            {

              this.store.state().get('marketingType') === 0 ?
                <WrappedForm
                  ref={(form) => (this._form = form)}
                  {...{
                    store: this.store,
                    marketingType: Enum.MARKETING_TYPE.FULL_REDUCTION
                  }}
                />
               :
                <WrappedShippingForm
                  ref={(form) => (this._form = form)}
                  {...{
                    store: this.store,
                    marketingType: Enum.MARKETING_TYPE.FREE_SHIPPING
                  }}
                />
            }
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
export default injectIntl(MarketingFullReductionAdd)
