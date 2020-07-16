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
  Checkbox
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
      operationLog: []
    };
  }

  componentDidMount() {
    this.getDict();
    this.getSubscriptionDetail(this.state.subscriptionId);
    this.getBySubscribeId(this.state.subscriptionId);
  }

  getSubscriptionDetail = (id: String) => {
    webapi
      .getSubscriptionDetail(id)
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
            nextDeliveryTime: subscriptionDetail.nextDeliveryTime,
            promotionCode: subscriptionDetail.promotionCode
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
              }

              // if(this.state.petsId){
              //   this.petsById(this.state.petsId);
              // }
              // if(this.state.deliveryAddressId){
              //   this.addressById(this.state.deliveryAddressId, 'delivery');
              // }
            }
          );
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

  addressById = (id: String, type: String) => {
    webapi.addressById(id).then((data) => {
      const { res } = data;
      if (res.code === 'K-000000') {
        if (type === 'delivery') {
          let info = res.context;
          let deliveryAddressInfo = {
            countryId: info.countryId,
            cityId: info.cityId,
            address1: info.address1,
            address2: info.address2
          };
          setTimeout(() => {
            this.setState(
              {
                deliveryAddressInfo: deliveryAddressInfo
              },
              () => {
                if (
                  this.state.deliveryAddressId === this.state.billingAddressId
                ) {
                  this.setState({
                    billingAddressInfo: deliveryAddressInfo
                  });
                } else {
                  this.addressById(this.state.billingAddressId, 'billing');
                }
              }
            );
          }, 100);
        }
        if (type === 'billing') {
          let info = res.context;
          let billingAddressInfo = {
            countryId: info.countryId,
            cityId: info.cityId,
            address1: info.address1,
            address2: info.address2
          };
          setTimeout(() => {
            this.setState({
              billingAddressInfo: billingAddressInfo
            });
          }, 100);
        }
      }
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

    this.querySysDictionary('Frequency');
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
          if (type === 'Frequency') {
            this.setState({
              frequencyList: res.context.sysDictionaryVOS
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

  onGoodsChange = ({ field, goodsId, value }) => {
    let data = this.state.goodsInfo;
    data = data.map((item) => {
      if (item.skuId === goodsId) {
        item.subscribeNum = value;
      }
      return item;
    });
    this.setState({
      goodsInfo: data
    });
  };

  updateSubscription = () => {
    const {
      subscriptionInfo,
      goodsInfo,
      deliveryAddressId,
      billingAddressId
    } = this.state;
    let params = {
      billingAddressId: deliveryAddressId,
      cycleTypeId: subscriptionInfo.frequency,
      deliveryAddressId: billingAddressId,
      goodsItems: goodsInfo,
      nextDeliveryTime: moment(subscriptionInfo.nextDeliveryTime).format(
        'YYYY-MM-DD'
      ),
      subscribeId: subscriptionInfo.subscriptionNumber
    };
    webapi
      .updateSubscription(params)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Successful');
        } else {
          message.error('Unsuccessful');
        }
      })
      .catch((err) => {
        message.error('Unsuccessful');
      });
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
          this.setState({
            deliveryList: addressList,
            customerAccount: customerAccount
          });
        }
        if (type === 'BILLING') {
          this.setState({
            billingList: addressList,
            customerAccount: customerAccount
          });
        }
      }
    });
  };
  deliveryOpen = () => {
    if (this.state.deliveryAddressId === this.state.billingAddressId) {
      this.setState({
        sameFlag: true,
        visibleShipping: true
      });
    } else {
      this.setState({
        sameFlag: false,
        visibleShipping: true
      });
    }
  };
  deliveryOK = () => {
    const { deliveryList, deliveryAddressId } = this.state;
    let deliveryAddressInfo = deliveryList.find((item) => {
      return item.deliveryAddressId === deliveryAddressId;
    });

    if (this.state.sameFlag) {
      this.setState({
        deliveryAddressInfo: deliveryAddressInfo,
        billingAddressInfo: deliveryAddressInfo,
        visibleShipping: false
      });
    } else {
      this.setState({
        deliveryAddressInfo: deliveryAddressInfo,
        visibleShipping: false
      });
    }
  };
  billingOK = () => {
    const { billingList, billingAddressId } = this.state;
    let billingAddressInfo = billingList.find((item) => {
      return item.deliveryAddressId === billingAddressId;
    });
    this.setState({
      billingAddressInfo: billingAddressInfo,
      visibleBilling: false
    });
  };

  getBySubscribeId = (id: String) => {
    let params = {
      subscribeId: id
    };
    webapi.getBySubscribeId(params).then((data) => {
      const { res } = data;
      if (res.code === 'K-000000') {
        let operationLog = res.context.subscriptionLogsVOS;
        this.setState({
          operationLog: operationLog
        });
      }
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
      operationLog
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
          <Menu.Item key={item.id}>
            <Link to={'/order-detail/' + item.orderNumber}>
              {item.recentOrderId + '(' + item.orderStatus + ')'}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    );
    // const cartExtra = (
    //   <Button type="link"  style={{fontSize:16,}}>Skip Next Dilivery</Button>
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
            <span style={{ margin: 'auto 0' }}>{record.goodsName}</span>
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
                let goodsId = record.skuId;
                this.onGoodsChange({
                  field: 'nextDeliveryTime',
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

    enum operatorDic {
      PLATFORM = 'Platform',
      CUSTOMER = 'Customer',
      SUPPLIER = 'Supplier'
    }

    const operatorColumns = [
      {
        title: 'Operator Type',
        dataIndex: 'operatorType',
        key: 'operatorType'
      },
      {
        title: 'Operator',
        dataIndex: 'operator',
        key: 'operator'
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (time) =>
          time &&
          moment(time)
            .format(Const.TIME_FORMAT)
            .toString()
      },
      {
        title: 'Operation Category',
        dataIndex: 'operationCategory',
        key: 'operationCategory'
      },
      {
        title: 'Operation Log',
        dataIndex: 'operationLog',
        key: 'operationLog',
        width: '50%'
      }
    ];
    const styles = {
      backItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 20
      }
    } as any;

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
                Subscription Time :
                <span>{subscriptionInfo.subscriptionTime}</span>
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
                Consumer : <span>{subscriptionInfo.consumer}</span>
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
                  style={{ width: '50%' }}
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
                <p>Next order date</p>
                {/* <p style={{ color: '#808285' }}>
                  {subscriptionInfo.nextDeliveryTime}
                </p> */}
                <DatePicker
                  defaultValue={moment(
                    subscriptionInfo.nextDeliveryTime,
                    'MMMM Do YY'
                  )}
                  onChange={(value) => {
                    this.onSubscriptionChange({
                      field: 'nextDeliveryTime',
                      value
                    });
                  }}
                  format={'MMMM Do YY'}
                  style={{ width: '50%' }}
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
                    <span>$123</span>
                  </div>
                  <div className="flex-between">
                    <span>Subscription Save Discount</span>
                    <span>-$12</span>
                  </div>
                  <div className="flex-between">
                    <span>Promotion Code</span>
                    <span>{subscriptionInfo.promotionCode}</span>
                  </div>
                  <div className="flex-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
              </Card>
              <div className="order-summary-total flex-between">
                <span>Total (Inclu IVA):</span>
                <span>$0</span>
              </div>
              <Row style={{ marginTop: 20 }}>
                <Col span={16}>
                  <Input placeholder="Promotional code" />
                </Col>
                <Col span={8}>
                  <Button style={{ marginLeft: 20 }} type="primary">
                    Apply
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="consumer-info" style={{ marginTop: 20 }}>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Delivery Address</label>
                </Col>

                <Col span={12}>
                  <Button type="link" onClick={() => this.deliveryOpen()}>
                    Change
                  </Button>
                </Col>

                <Col span={18}>
                  <p style={{ width: 140 }}>Country: </p>
                  <p>
                    {deliveryAddressInfo
                      ? this.getDictValue(
                          countryArr,
                          deliveryAddressInfo.countryId
                        )
                      : ''}
                  </p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>City: </p>
                  <p>
                    {deliveryAddressInfo
                      ? this.getDictValue(cityArr, deliveryAddressInfo.cityId)
                      : ''}
                  </p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>
                    {deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}
                  </p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address2: </p>
                  <p>
                    {deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Billing Address</label>
                </Col>
                <Col span={12}>
                  <Button
                    type="link"
                    onClick={() => {
                      this.setState({
                        visibleBilling: true
                      });
                    }}
                  >
                    Change
                  </Button>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Country: </p>
                  <p>
                    {billingAddressInfo
                      ? this.getDictValue(
                          countryArr,
                          billingAddressInfo.countryId
                        )
                      : ''}
                  </p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>City: </p>
                  <p>
                    {billingAddressInfo
                      ? this.getDictValue(cityArr, billingAddressInfo.cityId)
                      : ''}
                  </p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>{billingAddressInfo ? billingAddressInfo.address1 : ''}</p>
                </Col>
                <Col span={18}>
                  <p style={{ width: 140 }}>Address2: </p>
                  <p>{billingAddressInfo ? billingAddressInfo.address2 : ''}</p>
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
            <Col span={12}>
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
            </Col>
          </Row>

          <Row style={styles.backItem}>
            <Collapse>
              <Panel
                header={<FormattedMessage id="operationLog" />}
                key="1"
                style={{ paddingRight: 10 }}
              >
                <Row>
                  <Col span={24}>
                    <Table
                      rowKey={(record, index) => index.toString()}
                      columns={operatorColumns}
                      dataSource={operationLog}
                      pagination={false}
                      bordered
                    />
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Row>

          <Modal
            style={{ width: '500px' }}
            title="Choose From Saved Shipping Address"
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
              Same as Delivery Address
            </Checkbox>
            <Radio.Group
              value={this.state.deliveryAddressId}
              onChange={(e) => {
                let value = e.target.value;
                this.setState({
                  deliveryAddressId: value
                });
              }}
            >
              {deliveryList.map((item) => (
                <Card
                  style={{ width: 472, marginBottom: 10 }}
                  bodyStyle={{ padding: 10 }}
                  key={item.deliveryAddressId}
                >
                  <Radio value={item.deliveryAddressId}>
                    <div style={{ display: 'inline-grid' }}>
                      <p>{item.firstName + item.lastName}</p>
                      <p>{customerAccount}</p>
                      <p>
                        {this.getDictValue(cityArr, item.cityId) +
                          ',' +
                          this.getDictValue(countryArr, item.countryId)}
                      </p>
                      <p>{item.address1}</p>
                    </div>
                  </Radio>
                </Card>
              ))}
            </Radio.Group>
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
              value={this.state.billingAddressId}
              onChange={(e) => {
                let value = e.target.value;
                this.setState({
                  billingAddressId: value
                });
              }}
            >
              {billingList.map((item) => (
                <Card
                  style={{ width: 472, marginBottom: 10 }}
                  bodyStyle={{ padding: 10 }}
                  key={item.deliveryAddressId}
                >
                  <Radio value={item.deliveryAddressId}>
                    <div style={{ display: 'inline-grid' }}>
                      <p>{item.firstName + item.lastName}</p>
                      <p>{customerAccount}</p>
                      <p>
                        {this.getDictValue(countryArr, item.countryId) +
                          ',' +
                          this.getDictValue(cityArr, item.cityId)}
                      </p>
                      <p>{item.address1}</p>
                    </div>
                  </Radio>
                </Card>
              ))}
            </Radio.Group>
          </Modal>
        </Card>

        <div className="bar-button">
          <Button type="primary" onClick={() => this.updateSubscription()}>
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
