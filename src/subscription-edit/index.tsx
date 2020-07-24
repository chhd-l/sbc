import React from 'react';
import {
  Breadcrumb,
  Tabs,
  Card,
  Dropdown,
  Icon,
  Menu,
  Row,
  Col,
  Button,
  Input,
  Select,
  message,
  DatePicker,
  Table,
  InputNumber,
  Collapse,
  Modal,
  Radio,
  Checkbox,
  Tag
} from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb, SelectGroup, Const } from 'qmkit';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from './webapi';
import moment from 'moment';

const Panel = Collapse.Panel;

const InputGroup = Input.Group;
const { Option } = Select;
/**
 * 订单详情
 */
export default class SubscriptionDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Edit',
      subscriptionId: this.props.match.params.subId,
      loading: true,
      orderInfo: {},
      subscriptionInfo: {},
      recentOrderList: [],
      frequencyList: [],
      goodsInfo: [],
      petsId: '',
      petsInfo: {},
      paymentInfo: {},
      deliveryAddressId: '',
      deliveryAddressInfo: {},
      billingAddressId: '',
      billingAddressInfo: {},
      visibleShipping: false,
      visibleBilling: false,
      visiblePetInfo: false,
      countryArr: [],
      cityArr: [],
      deliveryList: [],
      billingList: [],
      customerAccount: '',
      sameFlag: false,
      originalParams: {},
      isUnfoldedDelivery: false,
      isUnfoldedBilling: false,
      saveLoading: false,
      promotionCodeShow: '',
      promotionCodeInput: '',
      deliveryPrice: '',
      discountsPrice: ''
      // operationLog: []
    };
  }

  componentDidMount() {
    this.getDict();
    this.getSubscriptionDetail();
    // this.getBySubscribeId(this.state.subscriptionId);
  }

  getSubscriptionDetail = () => {
    webapi
      .getSubscriptionDetail(this.state.subscriptionId)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          let subscriptionDetail = res.context;
          let subscriptionInfo = {
            deliveryTimes: subscriptionDetail.deliveryTimes,
            subscriptionStatus:
              subscriptionDetail.subscribeStatus === '0'
                ? 'Active'
                : 'Inactive',
            subscriptionNumber: subscriptionDetail.subscribeId,
            subscriptionTime: subscriptionDetail.createTime,
            presciberID: subscriptionDetail.prescriberId,
            presciberName: subscriptionDetail.prescriberName,
            consumer: subscriptionDetail.customerName,
            consumerAccount: subscriptionDetail.customerAccount,
            consumerType: subscriptionDetail.customerType,
            phoneNumber: subscriptionDetail.customerPhone,
            frequency: subscriptionDetail.cycleTypeId,
            frequencyName: subscriptionDetail.frequency,
            nextDeliveryTime: subscriptionDetail.nextDeliveryTime
          };
          let orderInfo = {
            recentOrderId: subscriptionDetail.trades
              ? subscriptionDetail.trades[0].id
              : '',
            orderStatus: subscriptionDetail.trades
              ? subscriptionDetail.trades[0].tradeState.deliverStatus
              : ''
          };
          let recentOrderList = [];
          if (subscriptionDetail.trades) {
            for (let i = 0; i < subscriptionDetail.trades.length; i++) {
              let recentOrder = {
                recentOrderId: subscriptionDetail.trades[i].id,
                orderStatus:
                  subscriptionDetail.trades[i].tradeState.deliverStatus
              };
              recentOrderList.push(recentOrder);
            }
          }

          let goodsInfo = subscriptionDetail.goodsInfo;
          let paymentInfo = subscriptionDetail.paymentInfo;

          let subscribeNumArr = [];
          for (let i = 0; i < goodsInfo.length; i++) {
            subscribeNumArr.push(goodsInfo[i].subscribeNum);
          }
          let originalParams = {
            billingAddressId: subscriptionDetail.billingAddressId,
            cycleTypeId: subscriptionInfo.frequency,
            deliveryAddressId: subscriptionDetail.deliveryAddressId,
            subscribeNumArr: subscribeNumArr,
            nextDeliveryTime: subscriptionInfo.nextDeliveryTime,
            promotionCode: subscriptionDetail.promotionCode
          };

          this.setState(
            {
              subscriptionInfo: subscriptionInfo,
              orderInfo: orderInfo,
              recentOrderList: recentOrderList,
              goodsInfo: goodsInfo,
              paymentInfo: paymentInfo,
              petsId: subscriptionDetail.petsId,
              deliveryAddressId: subscriptionDetail.deliveryAddressId,
              deliveryAddressInfo: subscriptionDetail.consignee,
              billingAddressId: subscriptionDetail.billingAddressId,
              billingAddressInfo: subscriptionDetail.invoice,
              originalParams: originalParams,
              promotionCodeShow: subscriptionDetail.promotionCode,
              loading: false
            },
            () => {
              if (
                this.state.deliveryAddressInfo &&
                this.state.deliveryAddressInfo.customerId
              ) {
                let customerId = this.state.deliveryAddressInfo.customerId;
                this.getAddressList(customerId, 'DELIVERY');
                this.getAddressList(customerId, 'BILLING');
                this.applyPromationCode(this.state.promotionCodeShow);
              }

              // if(this.state.petsId){
              //   this.petsById(this.state.petsId);
              // }
              // if(this.state.deliveryAddressId){
              //   this.addressById(this.state.deliveryAddressId, 'delivery');
              // }
            }
          );
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error('Unsuccessful');
      });
  };

  petsById = (id) => {
    let params = {
      petsId: id
    };
    webapi
      .petsById(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          let petsInfo = res.context.context;
          this.setState({
            petsInfo: petsInfo
          });
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };

  getDict = () => {
    if (JSON.parse(sessionStorage.getItem('dict-country'))) {
      let countryArr = JSON.parse(sessionStorage.getItem('dict-country'));
      this.setState({
        countryArr: countryArr
      });
    } else {
      this.querySysDictionary('country');
    }
    if (JSON.parse(sessionStorage.getItem('dict-city'))) {
      let cityArr = JSON.parse(sessionStorage.getItem('dict-city'));
      this.setState({
        cityArr: cityArr
      });
    } else {
      this.querySysDictionary('city');
    }

    this.querySysDictionary('Frequency_week');
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          if (type === 'city') {
            this.setState({
              cityArr: res.context.sysDictionaryVOS
            });
            sessionStorage.setItem(
              'dict-city',
              JSON.stringify(res.context.sysDictionaryVOS)
            );
          }
          if (type === 'country') {
            this.setState({
              countryArr: res.context.sysDictionaryVOS
            });
            sessionStorage.setItem(
              'dict-country',
              JSON.stringify(res.context.sysDictionaryVOS)
            );
          }
          if (type === 'Frequency_week') {
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_month')
            );
          }
          if (type === 'Frequency_month') {
            let frequencyList = [
              ...this.state.frequencyList,
              ...res.context.sysDictionaryVOS
            ];
            this.setState({
              frequencyList: frequencyList
            });
          }
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };
  onSubscriptionChange = ({ field, value }) => {
    let data = this.state.subscriptionInfo;
    data[field] = value;
    this.setState({
      subscriptionInfo: data
    });
  };

  onGoodsChange = ({ goodsId, value }) => {
    let data = this.state.goodsInfo;
    data = data.map((item) => {
      if (item.skuId === goodsId) {
        item.subscribeNum = value;
      }
      return item;
    });
    this.setState(
      {
        goodsInfo: data
      },
      () => {
        this.applyPromationCode(this.state.promotionCodeShow);
      }
    );
  };

  updateSubscription = () => {
    const {
      subscriptionInfo,
      goodsInfo,
      deliveryAddressId,
      billingAddressId,
      originalParams
    } = this.state;
    this.setState({
      saveLoading: true
    });
    let subscribeNumArr = [];
    let validNum = true;
    for (let i = 0; i < goodsInfo.length; i++) {
      if (goodsInfo[i].subscribeNum) {
        subscribeNumArr.push(goodsInfo[i].subscribeNum);
      } else {
        validNum = false;
        break;
      }
    }
    if (!validNum) {
      this.setState({
        saveLoading: false
      });
      message.error('Please enter the correct quantity!');
      return;
    }
    let params = {
      billingAddressId: billingAddressId,
      cycleTypeId: subscriptionInfo.frequency,
      deliveryAddressId: deliveryAddressId,
      goodsItems: goodsInfo,
      nextDeliveryTime: moment(subscriptionInfo.nextDeliveryTime).format(
        'YYYY-MM-DD'
      ),
      subscribeId: subscriptionInfo.subscriptionNumber,
      changeField: '',
      promotionCode: this.state.promotionCodeShow
    };
    let changeFieldArr = [];
    if (params.deliveryAddressId !== originalParams.deliveryAddressId) {
      changeFieldArr.push('Delivery Address');
    }
    if (params.cycleTypeId !== originalParams.cycleTypeId) {
      changeFieldArr.push('Frequency');
    }
    if (params.billingAddressId !== originalParams.billingAddressId) {
      changeFieldArr.push('Billing Address');
    }
    if (params.nextDeliveryTime !== originalParams.nextDeliveryTime) {
      changeFieldArr.push('Next Delivery Time');
    }
    if (
      (params.promotionCode ? params.promotionCode : '') !==
      (originalParams.promotionCode ? originalParams.promotionCode : '')
    ) {
      changeFieldArr.push('Promotion Code');
    }
    if (
      subscribeNumArr.join(',') !== originalParams.subscribeNumArr.join(',')
    ) {
      changeFieldArr.push('Order Quantity');
    }
    if (changeFieldArr.length > 0) {
      params.changeField = changeFieldArr.join(',');
    }

    webapi
      .updateSubscription(params)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.setState({
            saveLoading: false
          });
          message.success('Successful');
          this.getSubscriptionDetail();
        } else {
          this.setState({
            saveLoading: false
          });
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          saveLoading: false
        });
        message.error('Unsuccessful');
      });
  };
  compareField = (field1, field2, fieldName) => {
    if (field1 === field2) {
      return fieldName;
    } else {
      return '';
    }
  };

  getDictValue = (list, id) => {
    if (list && list.length > 0) {
      let item = list.find((item) => {
        return item.id === id;
      });
      if (item) {
        return item.name;
      } else {
        return id;
      }
    } else {
      return id;
    }
  };

  getAddressList = (customerId, type) => {
    webapi.getAddressListByType(customerId, type).then((data) => {
      const res = data.res;
      if (res.code === 'K-000000') {
        let addressList = res.context.customerDeliveryAddressVOList;
        let customerAccount = res.context.customerAccount;

        if (type === 'DELIVERY') {
          addressList = this.selectedOnTop(
            addressList,
            this.state.deliveryAddressId
          );

          this.setState({
            deliveryList: addressList,
            customerAccount: customerAccount
          });
        }
        if (type === 'BILLING') {
          addressList = this.selectedOnTop(
            addressList,
            this.state.billingAddressId
          );

          this.setState({
            billingList: addressList,
            customerAccount: customerAccount
          });
        }
      }
    });
  };
  selectedOnTop = (addressList, selectedId) => {
    let selectedAddress = addressList.find((item) => {
      return item.deliveryAddressId === selectedId;
    });
    if (selectedAddress) {
      addressList.unshift(selectedAddress);
      addressList = Array.from(new Set(addressList));
    }
    return addressList;
  };
  deliveryOpen = () => {
    let sameFlag = false;
    if (this.state.deliveryAddressId === this.state.billingAddressId) {
      sameFlag = true;
    }
    this.setState({
      sameFlag: sameFlag,
      visibleShipping: true,
      isUnfoldedDelivery: false
    });
  };
  deliveryOK = () => {
    const { deliveryList, deliveryAddressId } = this.state;
    let deliveryAddressInfo = deliveryList.find((item) => {
      return item.deliveryAddressId === deliveryAddressId;
    });
    let addressList = this.selectedOnTop(deliveryList, deliveryAddressId);

    if (this.state.sameFlag) {
      this.setState({
        deliveryAddressInfo: deliveryAddressInfo,
        billingAddressInfo: deliveryAddressInfo,
        deliveryList: addressList,
        visibleShipping: false
      });
    } else {
      this.setState({
        deliveryAddressInfo: deliveryAddressInfo,
        deliveryList: addressList,
        visibleShipping: false
      });
    }
  };
  billingOpen = () => {
    this.setState({
      visibleBilling: true,
      isUnfoldedBilling: false
    });
  };
  billingOK = () => {
    const { billingList, deliveryList, billingAddressId } = this.state;
    let billingAddressInfo = billingList.find((item) => {
      return item.deliveryAddressId === billingAddressId;
    });
    if (!billingAddressInfo) {
      billingAddressInfo = deliveryList.find((item) => {
        return item.deliveryAddressId === billingAddressId;
      });
    }
    let addressList = this.selectedOnTop(billingList, billingAddressId);
    this.setState({
      billingAddressInfo: billingAddressInfo,
      billingList: addressList,
      visibleBilling: false
    });
  };

  // getBySubscribeId = (id: String) => {
  //   let params = {
  //     subscribeId: id
  //   };
  //   webapi.getBySubscribeId(params).then((data) => {
  //     const { res } = data;
  //     if (res.code === 'K-000000') {
  //       let operationLog = res.context.subscriptionLogsVOS;
  //       this.setState({
  //         operationLog: operationLog
  //       });
  //     }
  //   });
  // };

  disabledStartDate = (endValue) => {
    let date = new Date();
    date.setDate(date.getDate() + 3);
    return endValue.valueOf() <= date.valueOf();
  };
  defaultValue = (nextDeliveryTime) => {
    let current = new Date(nextDeliveryTime);
    let normal = new Date();
    normal.setDate(normal.getDate() + 3);
    if (current >= normal) {
      return moment(new Date(current), 'MMMM Do YYYY');
    } else {
      return moment(new Date(normal), 'MMMM Do YYYY');
    }
  };

  subTotal = () => {
    const { goodsInfo } = this.state;
    let sum = 0;
    for (let i = 0; i < goodsInfo.length; i++) {
      if (goodsInfo[i].subscribeNum && goodsInfo[i].subscribePrice) {
        sum += +goodsInfo[i].subscribeNum * +goodsInfo[i].subscribePrice;
      }
    }
    return sum;
  };
  removePromotionCode = () => {
    this.setState(
      {
        promotionCodeInput: ''
      },
      () => {
        this.applyPromationCode();
      }
    );
  };
  applyPromationCode = (promotionCode?: String) => {
    const { goodsInfo, promotionCodeInput } = this.state;
    let goodsInfoList = [];
    for (let i = 0; i < goodsInfo.length; i++) {
      let goods = {
        goodsInfoId: goodsInfo[i].skuId,
        buyCount: goodsInfo[i].subscribeNum
      };
      goodsInfoList.push(goods);
    }
    let params = {
      goodsInfoList: goodsInfoList,
      promotionCode: promotionCode ? promotionCode : promotionCodeInput,
      isAutoSub: true
    };
    webapi
      .getPromotionPrice(params)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.setState({
            deliveryPrice: res.context.deliveryPrice,
            discountsPrice: res.context.discountsPrice,
            promotionCodeShow: res.context.promotionCode
          });
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
  };

  render() {
    const {
      orderInfo,
      recentOrderList,
      subscriptionInfo,
      frequencyList,
      goodsInfo,
      petsInfo,
      paymentInfo,
      deliveryAddressInfo,
      billingAddressInfo,
      countryArr,
      cityArr,
      deliveryList,
      billingList,
      customerAccount,
      promotionCodeShow
      // operationLog
    } = this.state;
    const cartTitle = (
      <div className="cart-title">
        <span>Subscription</span>
        <span className="order-time">
          {'#' + subscriptionInfo.deliveryTimes}
        </span>
      </div>
    );
    const menu = (
      <Menu>
        {recentOrderList.map((item) => (
          <Menu.Item key={item.recentOrderId}>
            <Link to={'/order-detail/' + item.recentOrderId}>
              {item.recentOrderId + '(' + item.orderStatus + ')'}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    );
    // const cartExtra = (
    //   <Button type="link"  style={{fontSize:16,}}>Skip Next Delivery</Button>
    // );
    const columns = [
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Product</span>
        ),
        key: 'Product',
        width: '40%',
        render: (text, record) => (
          <div style={{ display: 'flex' }}>
            <img src={record.goodsPic} style={{ width: 100 }} alt="" />
            <span style={{ margin: 'auto 10px' }}>{record.goodsName}</span>
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Price</span>,
        key: 'Price',
        width: '15%',
        render: (text, record) => (
          <div>
            <p style={{ textDecoration: 'line-through' }}>
              ${record.originalPrice}
            </p>
            <p>${record.subscribePrice}</p>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Quantity</span>
        ),
        dataIndex: 'subscribeNum',
        key: 'subscribeNum',
        width: '15%',
        render: (text, record) => (
          <div>
            <InputNumber
              min={1}
              max={100}
              onChange={(value) => {
                value = +value.toString().replace(/\D/g, '');
                let goodsId = record.skuId;
                this.onGoodsChange({
                  goodsId,
                  value
                });
              }}
              value={record.subscribeNum}
            />
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Total</span>,
        dataIndex: 'Total',
        key: 'Total',
        width: '15%',
        render: (text, record) => (
          <div>
            <span>${+record.subscribeNum * +record.subscribePrice}</span>
          </div>
        )
      }
    ];
    const totalCartTitleStyle = {
      background: '#fafafa',
      borderBottom: '2px solid #D7D7D7',
      color: '#8E8E8E',
      fontWeight: 500
    };

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            {<FormattedMessage id="subscription.edit" />}
          </Breadcrumb.Item>
        </BreadCrumb>
        <Card
          loading={this.state.loading}
          // title={cartTitle}
          title="Subscription Edit"
          bordered={false}
          // extra={cartExtra}
          style={{ margin: 20 }}
        >
          {/* subscription 基本信息 */}
          <Row className="subscription-basic-info">
            <Col span={24}>
              <span style={{ fontSize: '16px', color: '#3DB014' }}>
                {subscriptionInfo.subscriptionStatus}
              </span>
            </Col>
            <Col span={11} className="basic-info">
              <p>
                Subscription Number :{' '}
                <span>{subscriptionInfo.subscriptionNumber}</span>
              </p>
              <p>
                Subscription Date :
                <span>
                  {moment(new Date(subscriptionInfo.subscriptionTime)).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                </span>
              </p>
              <p>
                Presciber ID : <span>{subscriptionInfo.presciberID}</span>
              </p>
              <p>
                Presciber Name : <span>{subscriptionInfo.presciberName}</span>
              </p>
            </Col>
            <Col span={11} className="basic-info">
              <p>
                Consumer Name: <span>{subscriptionInfo.consumer}</span>
              </p>
              <p>
                Consumer Account :{' '}
                <span>{subscriptionInfo.consumerAccount}</span>
              </p>
              <p>
                Consumer Type : <span>{subscriptionInfo.consumerType}</span>
              </p>
              <p>
                Phone Number : <span>{subscriptionInfo.phoneNumber}</span>
              </p>
            </Col>
          </Row>

          {/* 订阅频率，配送日期修改 */}
          <Row style={{ marginTop: 20 }} gutter={16}>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Previous Orders</p>
                {orderInfo.recentOrderId ? (
                  <Dropdown overlay={menu} trigger={['click']}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      {orderInfo.recentOrderId +
                        '(' +
                        orderInfo.orderStatus +
                        ')'}
                      <Icon type="down" style={{ margin: '0 5px' }} />
                    </a>
                  </Dropdown>
                ) : null}
              </div>
            </Col>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Frequency</p>
                {/* <p style={{ color: '#808285' }}>
                  {subscriptionInfo.frequencyName}
                </p> */}
                <Select
                  style={{ width: '70%' }}
                  value={subscriptionInfo.frequency}
                  onChange={(value) => {
                    value = value === '' ? null : value;
                    this.onSubscriptionChange({
                      field: 'frequency',
                      value
                    });
                  }}
                >
                  {frequencyList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Next received date</p>
                {/* <p style={{ color: '#808285' }}>
                  {subscriptionInfo.nextDeliveryTime}
                </p> */}
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  defaultValue={moment(
                    new Date(subscriptionInfo.nextDeliveryTime),
                    'MMMM Do YYYY'
                  )}
                  onChange={(value) => {
                    this.onSubscriptionChange({
                      field: 'nextDeliveryTime',
                      value
                    });
                  }}
                  format={'MMMM Do YYYY'}
                  style={{ width: '70%' }}
                />
              </div>
            </Col>
          </Row>
          {/* subscription 和 total */}
          <Row style={{ marginTop: 20 }} gutter={16}>
            <Col span={16}>
              <Table
                rowKey={(record, index) => index.toString()}
                columns={columns}
                dataSource={goodsInfo}
                pagination={false}
              ></Table>
            </Col>
            <Col span={8}>
              <Card
                title="Order Summary"
                style={{ border: '1px solid #D7D7D7' }}
                headStyle={totalCartTitleStyle}
                bodyStyle={{ background: '#fafafa' }}
              >
                <div className="order-summary-content">
                  <div className="flex-between">
                    <span>Total</span>
                    <span>${this.subTotal()}</span>
                  </div>

                  <div className="flex-between">
                    <span>Promotion Discount</span>
                    <span>
                      $
                      {this.state.discountsPrice
                        ? this.state.discountsPrice
                        : 0}
                    </span>
                  </div>

                  <div className="flex-between">
                    <span>Promotion Code</span>
                    {promotionCodeShow ? (
                      <Tag closable onClose={() => this.removePromotionCode()}>
                        {promotionCodeShow}
                      </Tag>
                    ) : null}
                  </div>
                  <div className="flex-between">
                    <span>Shipping</span>
                    <span>
                      ${this.state.deliveryPrice ? this.state.deliveryPrice : 0}
                    </span>
                  </div>
                </div>
              </Card>
              <div className="order-summary-total flex-between">
                <span>Total (Inclu IVA):</span>
                <span>
                  $
                  {this.subTotal() -
                    +this.state.discountsPrice +
                    +this.state.deliveryPrice}
                </span>
              </div>
              <Row style={{ marginTop: 20 }}>
                <Col span={16}>
                  <Input
                    placeholder="Promotional code"
                    onChange={(e) => {
                      const value = (e.target as any).value;
                      this.setState({
                        promotionCodeInput: value
                      });
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Button
                    style={{ marginLeft: 20 }}
                    onClick={() => this.applyPromationCode()}
                    type="primary"
                  >
                    Apply
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="consumer-info" style={{ marginTop: 20 }}>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Delivery Address</label>
                </Col>

                <Col span={12}>
                  <Button type="link" onClick={() => this.deliveryOpen()}>
                    Change
                  </Button>
                </Col>

                <Col span={24}>
                  <p style={{ width: 140 }}>Name: </p>
                  <p>
                    {deliveryAddressInfo
                      ? deliveryAddressInfo.firstName +
                        ' ' +
                        deliveryAddressInfo.lastName
                      : ''}
                  </p>
                </Col>
                <Col span={24}>
                  <p style={{ width: 140 }}>City,Country: </p>
                  <p>
                    {this.getDictValue(cityArr, deliveryAddressInfo.cityId) +
                      ',' +
                      this.getDictValue(
                        countryArr,
                        deliveryAddressInfo.countryId
                      )}
                  </p>
                </Col>
                <Col span={24}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>
                    {deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}
                  </p>
                </Col>
                <Col span={24}>
                  <p style={{ width: 140 }}>Address2: </p>
                  <p>
                    {deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Billing Address</label>
                </Col>
                <Col span={12}>
                  <Button type="link" onClick={() => this.billingOpen()}>
                    Change
                  </Button>
                </Col>

                <Col span={24}>
                  <p style={{ width: 140 }}>Name: </p>
                  <p>
                    {billingAddressInfo
                      ? billingAddressInfo.firstName +
                        ' ' +
                        billingAddressInfo.lastName
                      : ''}
                  </p>
                </Col>
                <Col span={24}>
                  <p style={{ width: 140 }}>City,Country: </p>
                  <p>
                    {billingAddressInfo
                      ? this.getDictValue(cityArr, billingAddressInfo.cityId) +
                        ',' +
                        this.getDictValue(
                          countryArr,
                          billingAddressInfo.countryId
                        )
                      : ''}
                  </p>
                </Col>
                <Col span={24}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{billingAddressInfo ? billingAddressInfo.address1 : ''}</p>
                </Col>
                <Col span={24}>
                  <p style={{ width: 140 }}>Address2: </p>
                  <p>{billingAddressInfo ? billingAddressInfo.address2 : ''}</p>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={24}>
                  <label className="info-title">Payment Method</label>
                </Col>

                <Col span={24}>
                  <p style={{ width: 140 }}>Payment Method: </p>
                  <p>{paymentInfo ? paymentInfo.vendor : ''}</p>
                </Col>
                <Col span={24}>
                  <p style={{ width: 140 }}>Card Number: </p>
                  <p>{paymentInfo ? paymentInfo.cardNumber : ''}</p>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="consumer-info">
            {/* <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Pet Infomation</label>
                </Col>
                <Col span={12}>
                  <Button
                    type="link"
                    onClick={() => {
                      this.setState({
                        visiblePetInfo: true
                      });
                    }}
                  >
                    Change
                  </Button>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Name: </p>
                  <p>{petsInfo ? petsInfo.petsName : ''}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Type: </p>
                  <p>{petsInfo ? petsInfo.petsType : ''}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Pet Birthday: </p>
                  <p>{petsInfo ? petsInfo.birthOfPets : ''}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Breed: </p>
                  <p>{petsInfo ? petsInfo.petsBreed : ''}</p>
                </Col>
              </Row>
            </Col> */}
            {/* <Col span={12}>
              <Row>
                <Col span={18}>
                  <label className="info-title">Payment Method</label>
                </Col>

                <Col span={18}>
                  <p style={{ width: 140 }}>Payment Method: </p>
                  <p>{paymentInfo ? paymentInfo.vendor : ''}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Card Number: </p>
                  <p>{paymentInfo ? paymentInfo.cardNumber : ''}</p>
                </Col>
              </Row>
            </Col> */}
          </Row>

          <Modal
            style={{ width: '500px' }}
            title="Choose From Saved Delivery Address"
            visible={this.state.visibleShipping}
            onOk={() => this.deliveryOK()}
            onCancel={() => {
              this.setState({
                visibleShipping: false
              });
            }}
          >
            <Checkbox
              checked={this.state.sameFlag}
              onChange={(e) => {
                let value = e.target.checked;
                this.setState({
                  sameFlag: value
                });
              }}
            >
              Billing address is the same as
            </Checkbox>
            <Radio.Group
              style={{ maxHeight: 600, overflowY: 'auto' }}
              value={this.state.deliveryAddressId}
              onChange={(e) => {
                let value = e.target.value;
                this.setState({
                  deliveryAddressId: value
                });
              }}
            >
              {this.state.isUnfoldedDelivery
                ? deliveryList.map((item) => (
                    <Card
                      style={{ width: 472, marginBottom: 10 }}
                      bodyStyle={{ padding: 10 }}
                      key={item.deliveryAddressId}
                    >
                      <Radio value={item.deliveryAddressId}>
                        <div style={{ display: 'inline-grid' }}>
                          <p>{item.firstName + item.lastName}</p>
                          <p>
                            {this.getDictValue(cityArr, item.cityId) +
                              ',' +
                              this.getDictValue(countryArr, item.countryId)}
                          </p>
                          <p>{item.address1}</p>
                          <p>{item.address2}</p>
                        </div>
                      </Radio>
                    </Card>
                  ))
                : deliveryList.map((item, index) =>
                    index < 2 ? (
                      <Card
                        style={{ width: 472, marginBottom: 10 }}
                        bodyStyle={{ padding: 10 }}
                        key={item.deliveryAddressId}
                      >
                        <Radio value={item.deliveryAddressId}>
                          <div style={{ display: 'inline-grid' }}>
                            <p>{item.firstName + item.lastName}</p>
                            <p>
                              {this.getDictValue(cityArr, item.cityId) +
                                ',' +
                                this.getDictValue(countryArr, item.countryId)}
                            </p>
                            <p>{item.address1}</p>
                            <p>{item.address2}</p>
                          </div>
                        </Radio>
                      </Card>
                    ) : null
                  )}
            </Radio.Group>
            {this.state.isUnfoldedDelivery ||
            deliveryList.length <= 2 ? null : (
              <Button
                type="link"
                onClick={() => {
                  this.setState({
                    isUnfoldedDelivery: true
                  });
                }}
              >
                Unfolded all delivery addresses
              </Button>
            )}
          </Modal>

          <Modal
            title="Choose From Saved Billing Address"
            style={{ width: '500px' }}
            visible={this.state.visibleBilling}
            onOk={() => this.billingOK()}
            onCancel={() => {
              this.setState({
                visibleBilling: false
              });
            }}
          >
            <Radio.Group
              style={{ maxHeight: 600, overflowY: 'auto' }}
              value={this.state.billingAddressId}
              onChange={(e) => {
                let value = e.target.value;
                this.setState({
                  billingAddressId: value
                });
              }}
            >
              {this.state.isUnfoldedBilling
                ? billingList.map((item) => (
                    <Card
                      style={{ width: 472, marginBottom: 10 }}
                      bodyStyle={{ padding: 10 }}
                      key={item.deliveryAddressId}
                    >
                      <Radio value={item.deliveryAddressId}>
                        <div style={{ display: 'inline-grid' }}>
                          <p>{item.firstName + item.lastName}</p>
                          <p>
                            {this.getDictValue(countryArr, item.countryId) +
                              ',' +
                              this.getDictValue(cityArr, item.cityId)}
                          </p>
                          <p>{item.address1}</p>
                          <p>{item.address2}</p>
                        </div>
                      </Radio>
                    </Card>
                  ))
                : billingList.map((item, index) =>
                    index < 2 ? (
                      <Card
                        style={{ width: 472, marginBottom: 10 }}
                        bodyStyle={{ padding: 10 }}
                        key={item.deliveryAddressId}
                      >
                        <Radio value={item.deliveryAddressId}>
                          <div style={{ display: 'inline-grid' }}>
                            <p>{item.firstName + item.lastName}</p>
                            <p>
                              {this.getDictValue(countryArr, item.countryId) +
                                ',' +
                                this.getDictValue(cityArr, item.cityId)}
                            </p>
                            <p>{item.address1}</p>
                            <p>{item.address2}</p>
                          </div>
                        </Radio>
                      </Card>
                    ) : null
                  )}
            </Radio.Group>
            {this.state.isUnfoldedBilling || billingList.length <= 2 ? null : (
              <Button
                type="link"
                onClick={() => {
                  this.setState({
                    isUnfoldedBilling: true
                  });
                }}
              >
                Unfolded all delivery addresses
              </Button>
            )}
          </Modal>
        </Card>

        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => this.updateSubscription()}
            loading={this.state.saveLoading}
          >
            {<FormattedMessage id="save" />}
          </Button>
          <Button
            style={{ marginLeft: 20 }}
            onClick={() => (history as any).go(-1)}
          >
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </div>
    );
  }
}
