import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppStore from './store';
import FreeShippingAddForm from './components/free-shipping-add-form';
import * as Enum from '../common-components/marketing-enum';
import '../index.less';
const WrappedForm = Form.create()(FreeShippingAddForm);
@StoreProvider(AppStore, { debug: __DEV__ })
class MarketingFreeShippingAdd extends React.Component<any, any> {
  store: AppStore;
  _form;

  props: {
    intl: any;
    match: any;
    location;
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { marketingId } = this.props.match && this.props.match.params ? this.props.match.params : null;
    if (marketingId) {
      this.store.init(marketingId);
    } else {
      const bean = this.store.get('marketingBean').merge({ promotionCode: this.store.randomPromotionCode() });
      this.store.shippingBeanOnChange(bean);
    }
    this.store.getAllGroups();
  }

  render() {
    // const state = this.props.location.state;
    const { marketingId } = this.props.match && this.props.match.params ? this.props.match.params : null;
    // const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_free_shipping_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>{marketingId ?
              <FormattedMessage id="Marketing.EditfreeShipping" /> : <FormattedMessage id="Marketing.CreatefreeShipping" />}</Breadcrumb.Item>
          </BreadCrumb>

          <div className="container-search marketing-container">
            <Headline title={marketingId ?
              this.props.intl.formatMessage({
                id: 'Marketing.EditfreeShipping',
              })
              :
              this.props.intl.formatMessage({
                id: 'Marketing.CreatefreeShipping',
              })
            } />
            <Alert message={
              this.props.intl.formatMessage({
                id: 'Marketing.reductionTip',
              })
            } type="info" showIcon />
            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                marketingType: Enum.MARKETING_TYPE.FREE_SHIPPING
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}

export default injectIntl(MarketingFreeShippingAdd)
