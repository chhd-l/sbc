import React, { Component } from 'react';
import { Headline, BreadCrumb, history, Const } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon, Form } from 'antd';
import './index.less';
import ConsumerInformation from './components/consumerInformation';
import SelectedProduct from './components/selectedProduct';
import PaymentInformation from './components/paymentInformation';

import { getShopToken } from './webapi';

const { Step } = Steps;

class ManualOrder extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    let { storeId } = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));

    this.state = {
      id: this.props.match.params.id,
      title: 'Valet order',
      current: 0,
      customer: {
        customerId: '',
        customerName: '',
        customerAccount: ''
      },
      storeId: storeId,
      list: []
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }
  next(e) {
    e.preventDefault();
    let { customer, current, list } = this.state;
    this.props.form.validateFields((err) => {
      if (!err && customer.customerId) {
        if (current === 1) {
          if (list.length > 0) {
            this.getShopTokenJump();
          } else {
            message.info('please add product');
          }
        } else {
          current++;
        }
        this.setState({ current });
      }
    });
  }

  turnShowPage = (token) => {
    window.open(`https://shopstg.royalcanin.com/de/cart?stoken=${token}`, 'newwindow', 'height=500, width=800, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
  };
  getShopTokenJump = async (other?: string) => {
    let { customer, current } = this.state;
    const { res } = await getShopToken(customer.customerId, {});
    this.turnShowPage(res.context);
    if (other !== 'other') {
      current = current + 1;
      this.setState({
        current
      });
    }
  };

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  componentWillMount() {}

  getCustomer = (customer) => {
    this.setState({
      customer
    });
  };
  //获取购物车信息
  getCartsList = (list) => {
    this.setState({
      list
    });
  };
  render() {
    const { current, title, customer, storeId } = this.state;
    const steps = [
      {
        title: 'Consumer information',
        controller: <ConsumerInformation form={this.props.form} customer={customer} stepName={'Consumer information'} getCustomerId={this.getCustomer} />
      },
      {
        title: 'Selected product',
        controller: <SelectedProduct stepName={'Product list:'} carts={this.getCartsList} storeId={storeId} customer={customer} />
      },
      {
        title: 'Delivery & payment information',
        controller: <PaymentInformation turnShowPage={this.getShopTokenJump} stepName={'Delivery & payment information'} />
      }
    ];
    // if (noLanguageSelect) {
    //   steps.shift();
    // }
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search" id="navigationStep">
          <Headline title={title} />
          <Steps current={current} labelPlacement="vertical">
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].controller}</div>
          <div className="steps-action">
            {current === 0 && (
              <span>
                <Button type="primary">Register</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    history.push('/customer-list');
                  }}
                >
                  Pet owner list
                </Button>
              </span>
            )}
            {current === 1 && (
              <Button style={{ marginRight: 15 }} onClick={() => this.prev()}>
                <Icon type="left" /> Return
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.next(e)}>
                Next step <Icon type="right" />
              </Button>
            )}
            {/* {current !== steps.length - 1 && (
              <Button type="primary" onClick={(e) => this.updateNavigation(e)}>
                Submit <Icon type="right" />
              </Button>
            )} */}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(ManualOrder);
