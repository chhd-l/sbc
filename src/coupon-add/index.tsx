import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';

import { Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import Appstore from './store';
import MobileShowBox from './components/mobile-show-box';
import CouponInfoForm from './components/coupon-info-form';
import FreeShipingForm from './components/free-shipping-add-form';
import * as Enum from '@/marketing-add/common-components/marketing-enum';
const CouponInfoFormBox = Form.create()(CouponInfoForm as any);
const CouponInfoRelax = Relax(CouponInfoFormBox);
const WrappedShippingForm = Form.create()(FreeShipingForm);
@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { cid } = this.props.match.params;
    const state = this.props.location.state;
    const { couponType } = (state || {}) as any;
    this.store.init({ couponType, cid });
    // const { marketingId } = this.props.match && this.props.match.params ? this.props.match.params : null;
    // if (marketingId) {
    //   this.store.init(marketingId);
    // } else {
    //   const bean = this.store.get('marketingBean').merge({ promotionCode: this.store.randomPromotionCode() });
    //   this.store.shippingBeanOnChange(bean);
    // }
    const bean = this.store.get('shippingBean').merge({ promotionCode: this.store.randomPromotionCode() });
    this.store.shippingBeanOnChange(bean);
    this.store.getAllGroups();
  }

  render() {
    const id = this.store.state().get('couponId');
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return (
      <>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{id ? <FormattedMessage id="Marketing.EditCoupon" /> : <FormattedMessage id="Marketing.CreateCoupon" />}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container" style={{ paddingLeft: 60 }}>
          <Headline title={id ? <FormattedMessage id="Marketing.EditCoupon" /> : <FormattedMessage id="Marketing.CreateCoupon" />} />
          <div style={styles.container}>
            {/*<MobileShowBox />*/}
            {
              this.store.state().get('marketingType') === 0 ?
                <CouponInfoRelax /> :
                <WrappedShippingForm />
            }
          </div>
        </div>
      </>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row'
  }
} as any;
