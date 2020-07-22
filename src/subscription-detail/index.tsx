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
  Modal,
  Popconfirm,
  Radio,
  Collapse
} from 'antd';
import { StoreProvider } from 'plume2';
import { Link } from 'react-router-dom';

import { Headline, BreadCrumb, SelectGroup, Const } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from './webapi';
const Panel = Collapse.Panel;

import moment from 'moment';

const InputGroup = Input.Group;
const { Option } = Select;
/**
 * 订单详情
 */
export default class SubscriptionDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pageType: 'Details',
      subscriptionId: this.props.match.params.subId,
      loading: true,
      orderInfo: {},
      subscriptionInfo: {},
      recentOrderList: [],
      goodsInfo: [],
      petsId: '',
      petsInfo: {},
      paymentInfo: {},
      deliveryAddressId: '',
      deliveryAddressInfo: {},
      billingAddressId: '',
      billingAddressInfo: {},
      countryArr: [],
      cityArr: [],
      operationLog: []
    };
  }

  componentDidMount() {
    this.getDict();
    this.getSubscriptionDetail(this.state.subscriptionId);
    this.getBySubscribeId(this.state.subscriptionId);
  }

  //查询frequency
  // querySysDictionary = (type: String) => {
  //   webapi
  //     .querySysDictionary({ type: type })
  //     .then((data) => {
  //       const { res } = data;
  //       if (res.code === 'K-000000') {
  //         this.setState({
  //           frequencyList: res.context.sysDictionaryVOS
  //         });
  //       } else {
  //         message.error('Unsuccessful');
  //       }
  //     })
  //     .catch((err) => {
  //       message.error('Unsuccessful');
  //     });
  // };

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
            nextDeliveryTime: moment(
              new Date(subscriptionDetail.nextDeliveryTime)
            ).format('MMMM Do YYYY'),
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
            }
            // () => {
            //   if(this.state.petsId){
            //     this.petsById(this.state.petsId);
            //   }
            //   if(this.state.deliveryAddressId){
            //     this.addressById(this.state.deliveryAddressId, 'delivery');
            //   }
            // }
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
  skipNextDelivery = (id: String) => {
    this.setState({
      loading: true
    });
    webapi
      .cancelNextSubscription({ subscribeId: id })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.getSubscriptionDetail(this.state.subscriptionId);
          message.success('Successful');
        } else {
          this.setState({
            loading: false
          });
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

  orderNow = (id: String) => {
    this.setState({
      loading: true
    });
    webapi
      .orderNow({ subscribeId: id })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          this.getSubscriptionDetail(this.state.subscriptionId);
          message.success('Successful');
        } else {
          this.setState({
            loading: false
          });
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

  petsById = (id: String) => {
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

    // this.querySysDictionary('Frequency');
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
          // if (type === 'Frequency') {
          //   this.setState({
          //     frequencyList: res.context.sysDictionaryVOS
          //   });
          // }
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

  render() {
    const {
      orderInfo,
      recentOrderList,
      subscriptionInfo,
      goodsInfo,
      paymentInfo,
      deliveryAddressInfo,
      billingAddressInfo,
      countryArr,
      cityArr,
      operationLog
    } = this.state;
    const cartTitle = (
      <div className="cart-title">
        <span>Subscription Details</span>
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
    const cartExtra = (
      <div>
        <Popconfirm
          placement="topRight"
          title="Are you sure skip next delivery?"
          onConfirm={() =>
            this.skipNextDelivery(subscriptionInfo.subscriptionNumber)
          }
          okText="Confirm"
          cancelText="Cancel"
        >
          <Button type="link" style={{ fontSize: 16 }}>
            Skip Next Delivery
          </Button>
        </Popconfirm>
        <Popconfirm
          placement="topRight"
          title="Are you sure order now?"
          onConfirm={() => this.orderNow(subscriptionInfo.subscriptionNumber)}
          okText="Confirm"
          cancelText="Cancel"
        >
          <Button type="link" style={{ fontSize: 16 }}>
            Order Now
          </Button>
        </Popconfirm>
      </div>
    );
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
        width: '15%'
        // render: (text, record) => (
        //   <div>
        //     <InputNumber min={1} max={100} value={record.subscribeNum} />
        //   </div>
        // )
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
          time && moment(time).format(Const.TIME_FORMAT).toString()
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
            {<FormattedMessage id="subscription.detail" />}
          </Breadcrumb.Item>
        </BreadCrumb>
        <Card
          loading={this.state.loading}
          // title={cartTitle}
          title="Subscription Details"
          bordered={false}
          extra={
            subscriptionInfo.subscriptionStatus === 'Active' ? cartExtra : ''
          }
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
                <p style={{ color: '#808285' }}>
                  {subscriptionInfo.frequencyName}
                </p>
                {/* <Select style={{ width: '50%' }} value={subscriptionInfo.frequency}>
                  {frequencyList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select> */}
              </div>
            </Col>
            <Col span={8}>
              <div className="previous-order-info">
                <p>Next received date</p>
                <p style={{ color: '#808285' }}>
                  {/* {moment(
                    subscriptionInfo.nextDeliveryTime,
                    'MMMM Do YY'
                  )} */}
                  {subscriptionInfo.nextDeliveryTime}
                </p>
                {/* <DatePicker value={subscriptionInfo.nextDeliveryTime} format={'MMMM Do YY'} style={{ width: '50%' }} /> */}
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
                    <span>Subscription Save Discount</span>
                    <span>-$0</span>
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
                <span>${this.subTotal()}</span>
              </div>
              {/* <Row style={{ marginTop: 20 }}>
                <Col span={16}>
                  <Input placeholder="Promotional code" />
                </Col>
                <Col span={8}>
                  <Button style={{ marginLeft: 20 }} type="primary">
                    Apply
                  </Button>
                </Col>
              </Row> */}
            </Col>
          </Row>

          <Row className="consumer-info" style={{ marginTop: 20 }}>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Delivery Address</label>
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
                    {deliveryAddressInfo
                      ? this.getDictValue(cityArr, deliveryAddressInfo.cityId) +
                        ',' +
                        this.getDictValue(
                          countryArr,
                          deliveryAddressInfo.countryId
                        )
                      : ''}
                  </p>
                </Col>
                <Col span={24}>
                  <p style={{ width: 140 }}>Address1: </p>
                  <p>
                    {deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}
                  </p>
                </Col>
              </Row>
              <Col span={24}>
                <p style={{ width: 140 }}>Address2: </p>
                <p>{deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}</p>
              </Col>
            </Col>
            <Col span={8}>
              <Row>
                <Col span={12}>
                  <label className="info-title">Billing Address</label>
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
            </Col>
            */}
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
                      bordered
                    />
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Row>
        </Card>

        <div className="bar-button">
          <Button type="primary" onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </div>
    );
  }
}
