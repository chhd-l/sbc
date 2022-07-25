import React from 'react';
import PropTypes from 'prop-types';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Headline, BreadCrumb } from 'qmkit';
import CustomerInfo from './components/customer-info';
import GoodsList from './components/goods-list';
import { Button, Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';

import ExtraInfo from './components/extra-info';
import Form from 'antd/lib/form/Form';

class CreateOrder extends React.Component<any, any> {
  store: AppStore;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.store = ctx['_plume$Store'];
  }

  render() {
    return (
      <div>
        {/*面包屑*/}
        <BreadCrumb thirdLevel={this.props.edit && true}>
          {/* {this.props.edit ? <Breadcrumb.Item>订单列表</Breadcrumb.Item> : null} */}
          <Breadcrumb.Item>{this.props.edit ? <FormattedMessage id="Order.editOrder" /> : ''}</Breadcrumb.Item>
        </BreadCrumb>
        <Form>
          <div className="container-search">
            <Headline title={this.props.edit ? <FormattedMessage id="Order.editOrder" /> : <FormattedMessage id="Order.valetOrder" />} />
          </div>
          <div className="container">
            {/*客戶信息*/}
            <CustomerInfo
              form={this.props.form}
              {...{
                selectedCustomerInfo: this.store.state().get('selectedCustomerInfo'),
                flushStatus: this.props.flushStatus,
                selectedAddrId: this.store.state().get('selectedAddrId'),
                edit: this.props.edit
              }}
            />

            <strong style={styles.title}>
              <FormattedMessage id="Order.productList" />:{' '}
            </strong>

            {/*商品列表*/}
            <GoodsList
              form={this.props.form}
              {...{
                selectedCustomerId: this.store.state().get('selectedCustomerId'),
                flushStatus: this.props.flushStatus,
                edit: this.props.edit
              }}
            />

            {/*附件信息*/}
            <ExtraInfo
              form={this.props.form}
              {...{
                flushStatus: this.props.flushStatus,
                sperator: this.props.sperator,
                selectedInvoiceAddrId: this.props.selectedInvoiceAddrId
              }}
            />
          </div>
        </Form>
      </div>
    );
  }
}

const OrderForm = Form.create({})(CreateOrder);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderRepresentCustomer extends React.Component<any, any> {
  store: AppStore;
  _form: any;

  UNSAFE_componentWillMount() {
    const { tid } = this.props.match.params;
    this.store.initInvoiceSwitch();
    if (tid) {
      this.store.editInit(tid);
    }
    this.setState({
      edit: tid ? true : false
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      flushStatus: 0,
      edit: false
    };
  }

  render() {
    return (
      <div style={{ paddingBottom: 50 }}>
        <OrderForm
          ref={(form) => (this._form = form)}
          {...{
            flushStatus: this.state.flushStatus,
            edit: this.state.edit,
            sperator: this.store.state().getIn(['extra', 'sperator']),
            selectedInvoiceAddrId: this.store.state().get('selectedInvoiceAddrId')
          }}
        />
        <div className="bar-button">
          <Button onClick={() => this._createOrder()} type="primary" htmlType="submit" loading={this.state.submitting}>
            <FormattedMessage id="Public.save" />
          </Button>
          &nbsp;&nbsp;
          <Button
            htmlType="submit"
            onClick={() => {
              this.props.history.go(-1);
            }}
          >
            <FormattedMessage id="Public.cancel" />
          </Button>
        </div>
      </div>
    );
  }

  _createOrder = () => {
    const { onCreateOrder } = this.store;
    this._form.validateFields((err) => {
      if (!err) {
        onCreateOrder(this.state.edit);
      } else {
        this.setState({
          flushStatus: (window.crypto.getRandomValues(new Uint8Array(1)) * 0.001)
        });
      }
    });
  };
}

const styles = {
  title: {
    fontSize: 14,
    marginBottom: 10,
    display: 'block'
  }
} as any;
