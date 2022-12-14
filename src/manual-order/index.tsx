import React, { Component } from 'react';
import { Headline, BreadCrumb, history, Const, cache } from 'qmkit';
import { Breadcrumb, message, Steps, Button, Icon, Form } from 'antd';
import './index.less';
import ConsumerInformation from './components/consumerInformation';
import SelectedProduct from './components/selectedProduct';
import PaymentInformation from './components/paymentInformation';
import { FormattedMessage } from 'react-intl';
import { getShopToken, queryOrderStatus, getShopCouponCode, getGuestOrderResponse } from './webapi';

const { Step } = Steps;
class ManualOrder extends Component<any, any> {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    let { storeId } = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    this.state = {
      id: this.props.match.params.id,
      title: <FormattedMessage id="Order.valetOrder" />,
      current: 0,
      status: 1,
      url: '',
      context: null,
      customer: {
        customerId: '',
        customerName: '',
        customerAccount: ''
      },
      storeId: storeId,
      list: [],
      goodwillChecked: false,
      guest: false,
      felinStore: false,
      guestId: '',
      notNext: false,
      payinfotoken: '',
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }
  next(e) {
    e.preventDefault();
    let { customer, current, list, guest } = this.state;
    this.props.form.validateFields((err) => {
      if (!err && (customer.customerId || guest)) {
        if (current === 1) {
          if (list.length > 0) {
            this.getShopTokenJump();
          } else {
            message.info('please add product');
          }
        } else {
          current++;
          this.setState({ current });
        }
      }
    });
  }

  turnShowPage = (token, promocode, customerId) => {
    let { customer, url, guest, guestId, storeId, felinStore } = this.state;
    let userGroup = felinStore ? `userGroup=felinStore&` : 'userGroup=fgs&';
    let spromocode = promocode ? `spromocode=${promocode}&` : '';
    let guestParams = `guestId=${guestId}&userGroup=felinStore&petOwnerType=guest`;
    let params = guest ? guestParams : `${userGroup}${spromocode}stoken=${token}&scustomerId=${customerId}`
    let winObj = window.open(
      `${url.replace(/\/$/gi, '')}/cart?${params}`,
      'newwindow',
      'height=500, width=800, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no'
    );
    let loop = setInterval(async () => {
      if (winObj.closed) {
        clearInterval(loop);
        const { res } = guest ? await getGuestOrderResponse(storeId, guestId) : await queryOrderStatus(customer.customerId, token);
        if (res.code === Const.SUCCESS_CODE) {
          let d = {
            string: 1,
            boolean: 2,
            object: 3
          };
          let status = d[typeof res.context];
          this.setState({
            status,
            context: status === 3 ? res.context : null
          });
        } else {
          this.setState({
            status: 2
          });
        }
      }
    }, 500);
  };

  getShopTokenJump = async (other?: string) => {
    let { customer, current, goodwillChecked, guest } = this.state;
    let shopToken = '';
    if (!guest) {
      const { res } = await getShopToken(customer.customerId, {});
      shopToken = res.context || '';
    }

    // ??????????????? This is a goodwill order ???????????? promotion code ??????shop???
    let promocode = '';
    if (goodwillChecked) {
      const { res } = await getShopCouponCode();
      if (res.code !== Const.SUCCESS_CODE) {
        return;
      }
      promocode = res.context?.couponCode;
    }
    this.turnShowPage(shopToken, promocode, customer.customerId);
    this.setState({
      payinfotoken: shopToken
    })
    if (other !== 'other') {
      current = current + 1;
      this.setState({
        current
      });
    }
  };

  prev() {
    const current = this.state.current - 1;
    this.setState({ current, notNext: false });
  }

  componentWillMount() {
    let { customerId, customerName, customerAccount } = this.props?.location?.query ?? {};
    if (customerId && customerName && customerAccount) {
      this.setState({
        customer: {
          customerId,
          customerName,
          customerAccount
        }
      });
    }
  }

  componentDidMount() {
    let url = sessionStorage.getItem(cache.DOMAINNAME);
    this.setState({
      url
    });
  }

  componentWillUnmount() {
    sessionStorage.removeItem('user-group-value')
    sessionStorage.removeItem('pet-owner-type')
  }

  getCustomer = (customer) => {
    this.setState({
      customer
    });
  };

  getPetOwnerType = (type) => {
    if (type == 'guest') {
      this.setState({
        guest: true
      })
    } else {
      this.setState({
        guest: false
      })
    }
  }

  getUserGroupType = (type) => {
    if (type == 'felinStore') {
      this.setState({
        felinStore: true
      })
    } else {
      this.setState({
        felinStore: false
      })
    }
  }
  //?????????????????????
  getCartsList = (list) => {
    this.setState({
      list
    }, () => {
      const isSubscription = list.some(item => [1, 2].includes(item.goodsInfoFlag))
      this.setState({
        notNext: isSubscription && this.state.felinStore
      })
    });
  };
  handleGoodwillChecked = (value) => {
    console.log(value);
    this.setState({
      goodwillChecked: value
    });
  };
  getGuestId = (id) => {
    this.setState({
      guestId: id
    })
  }
  render() {
    const { current, title, customer, storeId, status, url, context, guest, felinStore, guestId, payinfotoken } = this.state;
    const steps = [
      {
        title: 'Consumer information',
        controller: (
          <ConsumerInformation
            form={this.props.form}
            customer={customer}
            storeId={storeId}
            stepName={'Consumer information'}
            getCustomerId={this.getCustomer}
            petOwnerType={this.getPetOwnerType}
            userGroupType={this.getUserGroupType}
          />
        )
      },
      {
        title: 'Selected product',
        controller: (
          <SelectedProduct
            url={url}
            stepName={'Product list'}
            carts={this.getCartsList}
            storeId={storeId}
            customer={customer}
            guest={guest}
            felinStore={felinStore}
            onGoodwillChecked={this.handleGoodwillChecked}
            guestId={this.getGuestId}
            guestKey={guestId}
          />
        )
      },
      {
        title: 'Delivery & payment information',
        controller: (
          <PaymentInformation
            context={context}
            turnShowPage={this.getShopTokenJump}
            status={status}
            customer={customer}
            stepName={'Delivery & payment information'}
            felinStore={felinStore}
            payinfotoken={payinfotoken}
          />
        )
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
              <Step key={item.title} title={<FormattedMessage id={`Order.${item.title}`} />} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].controller}</div>
          <div className="steps-action">
            {current === 0 && (
              <span>
                <Button type="primary">
                  <a style={{ color: '#fff' }} target="_blank" href={`${url}register`}>
                    <FormattedMessage id="Order.Register" />
                  </a>
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    history.push('/customer-list');
                  }}
                >
                  <FormattedMessage id="Order.Pet owner list" />
                </Button>
              </span>
            )}
            {current === 1 && (
              <Button style={{ marginRight: 15 }} onClick={() => this.prev()}>
                <Icon type="left" /> <FormattedMessage id="Order.Return" />
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button disabled={this.state.notNext} type="primary" onClick={(e) => this.next(e)}>
                <FormattedMessage id="Order.Next step" /> <Icon type="right" />
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
