import React from 'react';
import { StoreProvider } from 'plume2';
import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
import AppStore from './store';
//import SearchHead from './components/search-head';
import PaymentList from '@/payment-method/components/payment-list';
import './index.less';
import {Form} from "antd";
import { FormattedMessage } from 'react-intl';
/**
 * 退单列表
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderReturnList extends React.Component<any, any> {
  store: AppStore;
  _form;
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      // <AuthWrapper functionName="rolf001">
      //
      // </AuthWrapper>

    <div className="order-con">
      <BreadCrumb />
      <div className="container method-container">
        <Headline title={<FormattedMessage id="Setting.paymentMethod" />} />
        <PaymentList />
        {/*<WrappedForm ref={(form) => (this._form = form)} />*/}
      </div>
    </div>
    );
  }
}
