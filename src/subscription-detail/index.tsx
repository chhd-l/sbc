import React from 'react';
import { Breadcrumb, Tabs, Card, Dropdown, Icon, Menu, Row, Col, Button, Input, Select, message, DatePicker, Table, InputNumber, Modal, Popconfirm, Radio, Collapse, Spin, Tooltip } from 'antd';
import { StoreProvider } from 'plume2';
import { Link } from 'react-router-dom';

import { Headline, BreadCrumb, SelectGroup, Const, cache } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from './webapi';
const Panel = Collapse.Panel;

import moment from 'moment';

const { Search } = Input;

const InputGroup = Input.Group;
const { Option } = Select;
const { TabPane } = Tabs;
/**
 * 订单详情
 */
export default class SubscriptionDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Subscription details',
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
      operationLog: [],
      promotionCode: '',
      deliveryPrice: '',
      discountsPrice: '',
      frequencyList: [],
      promotionDesc: 'Subscription 0% Discount',
      noStartOrder: [],
      completedOrder: []
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
            subscriptionStatus: subscriptionDetail.subscribeStatus === '0' ? 'Active' : 'Inactive',
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
            nextDeliveryTime: moment(new Date(subscriptionDetail.nextDeliveryTime)).format('MMMM Do YYYY'),
            promotionCode: subscriptionDetail.promotionCode
          };
          let orderInfo = {
            recentOrderId: subscriptionDetail.trades ? subscriptionDetail.trades[0].id : '',
            orderStatus: subscriptionDetail.trades ? subscriptionDetail.trades[0].tradeState.deliverStatus : ''
          };
          let recentOrderList = [];
          if (subscriptionDetail.trades) {
            for (let i = 0; i < subscriptionDetail.trades.length; i++) {
              let recentOrder = {
                recentOrderId: subscriptionDetail.trades[i].id,
                orderStatus: subscriptionDetail.trades[i].tradeState.deliverStatus
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
              promotionCode: subscriptionDetail.promotionCode,
              noStartOrder: subscriptionDetail.noStartTradeList,
              completedOrder: subscriptionDetail.completedTradeList,
              loading: false
            },
            () => {
              this.applyPromationCode(this.state.promotionCode);
            }
          );
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.message || 'Unsuccessful');
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
          message.success('Operate successfully');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.message || 'Unsuccessful');
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
          message.success('Operate successfully');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.message || 'Unsuccessful');
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
        message.error(err.message || 'Unsuccessful');
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
                if (this.state.deliveryAddressId === this.state.billingAddressId) {
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
    this.querySysDictionary('Frequency_week');

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
            sessionStorage.setItem('dict-city', JSON.stringify(res.context.sysDictionaryVOS));
          }
          if (type === 'country') {
            this.setState({
              countryArr: res.context.sysDictionaryVOS
            });
            sessionStorage.setItem('dict-country', JSON.stringify(res.context.sysDictionaryVOS));
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
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
            this.setState({
              frequencyList: frequencyList
            });
          }
          // if (type === 'Frequency') {
          //   this.setState({
          //     frequencyList: res.context.sysDictionaryVOS
          //   });
          // }
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
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
    for (let i = 0; i < (goodsInfo ? goodsInfo.length : 0); i++) {
      if (goodsInfo[i].subscribeNum && goodsInfo[i].subscribePrice) {
        sum += +goodsInfo[i].subscribeNum * +goodsInfo[i].subscribePrice;
      }
    }
    return sum;
  };
  applyPromationCode = (promotionCode?: String) => {
    const { goodsInfo } = this.state;
    let goodsInfoList = [];
    for (let i = 0; i < (goodsInfo ? goodsInfo.length : 0); i++) {
      let goods = {
        goodsInfoId: goodsInfo[i].skuId,
        buyCount: goodsInfo[i].subscribeNum,
        goodsInfoFlag: 1
      };
      goodsInfoList.push(goods);
    }
    let params = {
      goodsInfoList: goodsInfoList,
      promotionCode: promotionCode,
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
        message.error(err.message || 'Unsuccessful');
      });
  };
  handleYearChange = (value) => {
    console.log(value);
  };
  tabChange = (key) => {
    console.log(`selected ${key}`);
  };

  render() {
    const { title, orderInfo, recentOrderList, subscriptionInfo, goodsInfo, paymentInfo, deliveryAddressInfo, billingAddressInfo, countryArr, cityArr, operationLog, frequencyList, noStartOrder, completedOrder } = this.state;
    const cartTitle = (
      <div className="cart-title">
        <span>Subscription Details</span>
        <span className="order-time">{'#' + subscriptionInfo.deliveryTimes}</span>
      </div>
    );
    const cartExtra = (
      <div>
        <Popconfirm placement="topRight" title="Are you sure skip next delivery?" onConfirm={() => this.skipNextDelivery(subscriptionInfo.subscriptionNumber)} okText="Confirm" cancelText="Cancel">
          <Tooltip placement="top" title="Skip Next Delivery">
            <Button type="link" style={{ fontSize: 16 }}>
              Skip Next Delivery
            </Button>
          </Tooltip>
        </Popconfirm>
        {/* <Popconfirm
          placement="topRight"
          title="Are you sure order now?"
          onConfirm={() => this.orderNow(subscriptionInfo.subscriptionNumber)}
          okText="Confirm"
          cancelText="Cancel"
        >
          <Button type="link" style={{ fontSize: 16 }}>
            Order Now
          </Button>
        </Popconfirm> */}
      </div>
    );
    const columns = [
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Product</span>,
        key: 'Product',
        width: '40%',
        render: (text, record) => (
          <div style={{ display: 'flex' }}>
            <img src={record.goodsPic} style={{ width: 60, height: 80 }} alt="" />
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
            <p style={{ textDecoration: 'line-through' }}>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + record.originalPrice}</p>
            <p>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + record.subscribePrice}</p>
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Quantity</span>,
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
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Delivery frequency</span>,
        dataIndex: 'frequency',
        key: 'frequency',
        width: '15%',
        render: (text, record) => (
          <div>
            <Select style={{ width: '70%' }} value={record.periodTypeId} disabled>
              {frequencyList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
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
            <span>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + +record.subscribeNum * +record.subscribePrice}</span>
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
        render: (time) => time && moment(time).format(Const.TIME_FORMAT).toString()
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

    const columns_no_start = [
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Product</span>,
        key: 'Product',
        width: '20%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img src={item.pic} style={{ width: 60, height: 80 }} alt="" />
                  <div style={{ margin: 'auto 10px' }}>
                    <p>{item.skuName}</p>
                    <p>{item.specDetails}</p>
                  </div>
                </div>
              ))}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Quantity</span>,
        key: 'subscribeNum',
        width: '10%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ margin: 'auto 10px' }}>
                  <p>X {item.num}</p>
                </div>
              ))}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Promotion code</span>,
        key: 'promotionCode',
        dataIndex: 'promotionCode',
        width: '20%',
        render: (text, record) => <div>{text}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Enjoy discount</span>,
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? '-' + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + record.tradePrice.discountsPrice : '-'}</div>
      },
      {
        title: <span style={{ fontWeight: 500 }}>Amount</span>,
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + record.tradePrice.totalPrice : '-'}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Shipment date</span>,
        key: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeItems && record.tradeItems[0].nextDeliveryTime ? record.tradeItems[0].nextDeliveryTime : '-'}</div>
      }
    ];
    const columns_completed = [
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Product</span>,
        key: 'Product',
        width: '30%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img src={item.pic} style={{ width: 60, height: 80 }} alt="" />
                  <div style={{ margin: 'auto 10px' }}>
                    <p>{item.skuName}</p>
                    <p>{item.specDetails}</p>
                  </div>
                </div>
              ))}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Quantity</span>,
        key: 'subscribeNum',
        width: '10%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ margin: 'auto 10px' }} key={index}>
                  <p>X {item.num}</p>
                </div>
              ))}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Enjoy discount</span>,
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? '-' + sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + record.tradePrice.discountsPrice : '-'}</div>
      },
      {
        title: <span style={{ fontWeight: 500 }}>Amount</span>,
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + record.tradePrice.totalPrice : '-'}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Shipment date</span>,
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeItems && record.tradeItems[0].nextDeliveryTime ? record.tradeItems[0].nextDeliveryTime : '-'}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Order status</span>,
        key: 'shipmentStatus',
        dataIndex: 'shipmentStatus',
        width: '10%',
        render: (text, record) => <div>{record.tradeItems && record.tradeItems[0].deliverStatus ? record.tradeItems[0].deliverStatus : '-'}</div>
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <Link to={'/order-detail/' + record.id}>
            <Tooltip placement="top" title="Details">
              <a style={styles.edit} className="iconfont iconDetails"></a>
            </Tooltip>
          </Link>
        )
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
          <Breadcrumb.Item>{<FormattedMessage id="subscription.detail" />}</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container-search">
          <Spin spinning={this.state.loading}>
            <Headline title={title} />
            <Row className="subscription-basic-info">
              <Col span={24}>
                <span style={{ fontSize: '16px', color: '#3DB014' }}>{subscriptionInfo.subscriptionStatus}</span>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  Subscription Number : <span>{subscriptionInfo.subscriptionNumber}</span>
                </p>
                <p>
                  Subscription Date :<span>{moment(new Date(subscriptionInfo.subscriptionTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
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
                  Consumer name: <span>{subscriptionInfo.consumer}</span>
                </p>
                <p>
                  Consumer Account : <span>{subscriptionInfo.consumerAccount}</span>
                </p>
                <p>
                  Consumer type : <span>{subscriptionInfo.consumerType}</span>
                </p>
                <p>
                  Phone Number : <span>{subscriptionInfo.phoneNumber}</span>
                </p>
              </Col>
            </Row>
            {/* subscription 和 total */}
            <Row style={{ marginTop: 20 }} gutter={16}>
              <Col span={24}>
                <Table rowKey={(record, index) => index.toString()} columns={columns} dataSource={goodsInfo} pagination={false}></Table>
              </Col>

              <Col span={8} offset={16}>
                <div className="flex-between">
                  <span>Subtotal</span>
                  <span style={styles.priceStyle}>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + this.subTotal()}</span>
                </div>

                <div className="flex-between">
                  <span>{this.state.promotionDesc}</span>
                  <span style={styles.priceStyle}>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (this.state.discountsPrice ? this.state.discountsPrice : 0)}</span>
                </div>

                <div className="flex-between">
                  <span>Shipping</span>
                  <span style={styles.priceStyle}>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (this.state.deliveryPrice ? this.state.deliveryPrice : 0)}</span>
                </div>
                <div className="flex-between">
                  <span>
                    <span>Total</span> (IVA Include):
                  </span>
                  <span style={styles.priceStyle}>{sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + (this.subTotal() - +this.state.discountsPrice + +this.state.deliveryPrice)}</span>
                </div>
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
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.firstName + ' ' + deliveryAddressInfo.lastName : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>City,Country: </p>
                    <p>{deliveryAddressInfo ? this.getDictValue(cityArr, deliveryAddressInfo.cityId) + ',' + this.getDictValue(countryArr, deliveryAddressInfo.countryId) : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>Address1: </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}</p>
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
                    <p>{billingAddressInfo ? billingAddressInfo.firstName + ' ' + billingAddressInfo.lastName : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>City,Country: </p>
                    <p>{billingAddressInfo ? this.getDictValue(cityArr, billingAddressInfo.cityId) + ',' + this.getDictValue(countryArr, billingAddressInfo.countryId) : ''}</p>
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
                    <p>{paymentInfo ? paymentInfo.paymentType : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>Card Number: </p>
                    <p>{paymentInfo && paymentInfo.payuPaymentMethod ? '**** **** **** ' + paymentInfo.payuPaymentMethod.last_4_digits : paymentInfo.adyenPaymentMethod ? '**** **** **** ' + paymentInfo.adyenPaymentMethod.lastFour : ''}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Spin>
        </div>
        <div className="container-search">
          <Headline
            title="Autoship order"
            // extra={
            //   <div>
            //     <Select defaultValue="2020" style={{ width: 150 }} onChange={this.handleYearChange}>
            //       <Option value="2020">2020</Option>
            //       <Option value="2019">2019</Option>
            //       <Option value="2018">2018</Option>
            //     </Select>
            //   </div>
            // }
          />
          <Tabs defaultActiveKey="1" onChange={this.tabChange}>
            <TabPane tab="No start" key="noStart">
              <Table rowKey={(record, index) => index.toString()} columns={columns_no_start} dataSource={noStartOrder} pagination={false}></Table>
            </TabPane>
            <TabPane tab="Completed" key="completed">
              <Table rowKey={(record, index) => index.toString()} columns={columns_completed} dataSource={completedOrder} pagination={false}></Table>
            </TabPane>
          </Tabs>
          <Row style={styles.backItem}>
            <Collapse>
              <Panel header={<FormattedMessage id="operationLog" />} key="1" style={{ paddingRight: 10 }}>
                <Row>
                  <Col span={24}>
                    <Table rowKey={(record, index) => index.toString()} columns={operatorColumns} dataSource={operationLog} bordered pagination={false} />
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Row>
        </div>

        <div className="bar-button">
          <Button type="primary" onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </div>
    );
  }
}
const styles = {
  priceStyle: {
    marginRight: 15
  },
  edit: {
    paddingRight: 10
  }
};
