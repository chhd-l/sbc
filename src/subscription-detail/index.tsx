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
import FormModalActor from '@/order-add/actor/form-modal-actor';

const { Search } = Input;

const { Option } = Select;
const { TabPane } = Tabs;

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return <FormattedMessage id="Subscription.order.notShipped" />;
  } else if (status == 'SHIPPED') {
    return <FormattedMessage id="Subscription.order.allShipments" />;
  } else if (status == 'PART_SHIPPED') {
    return <FormattedMessage id="Subscription.order.partialShipment" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="Subscription.order.invalid" />;
  } else {
    return <FormattedMessage id="Subscription.order.unknown" />;
  }
};
/**
 * 订单详情
 */
export default class Subscription extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Subscription.Subscriptions" />,
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
      operationLog: [],
      promotionCode: '',
      deliveryPrice: '',
      taxFeePrice: '',
      discountsPrice: '',
      frequencyList: [],
      promotionDesc: 'Promotion',
      noStartOrder: [],
      completedOrder: [],
      billingCityName: '',
      deliveryCityName: '',
      currencySymbol: ''
    };
  }

  componentDidMount() {
    this.getCurrencySymbol();
    this.getDict();
    this.getSubscription(this.state.subscriptionId);
    this.getBySubscribeId(this.state.subscriptionId);
  }

  //查询frequency
  // querySysDictionary = (type: String) => {
  //   webapi
  //     .querySysDictionary({ type: type })
  //     .then((data) => {
  //       const { res } = data;
  //       if (res.code === Const.SUCCESS_CODE) {
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

  getSubscription = (id: String) => {
    webapi
      .getSubscription(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let Subscription = res.context;
          let subscriptionInfo = {
            deliveryTimes: Subscription.deliveryTimes,
            subscriptionStatus: Subscription.subscribeStatus === '0' ? 'Active' : 'Inactive',
            subscriptionNumber: Subscription.subscribeId,
            subscriptionTime: Subscription.createTime,
            presciberID: Subscription.prescriberId,
            presciberName: Subscription.prescriberName,
            consumer: Subscription.customerName,
            consumerAccount: Subscription.customerAccount,
            consumerType: Subscription.customerType,
            phoneNumber: Subscription.customerPhone,
            frequency: Subscription.cycleTypeId,
            frequencyName: Subscription.frequency,
            nextDeliveryTime: moment(new Date(Subscription.nextDeliveryTime)).format('MMMM Do YYYY'),
            promotionCode: Subscription.promotionCode
          };
          let orderInfo = {
            recentOrderId: Subscription.trades ? Subscription.trades[0].id : '',
            orderStatus: Subscription.trades ? Subscription.trades[0].tradeState.deliverStatus : ''
          };
          let recentOrderList = [];
          if (Subscription.trades) {
            for (let i = 0; i < Subscription.trades.length; i++) {
              let recentOrder = {
                recentOrderId: Subscription.trades[i].id,
                orderStatus: Subscription.trades[i].tradeState.deliverStatus
              };
              recentOrderList.push(recentOrder);
            }
          }

          let goodsInfo = Subscription.goodsInfo;
          let paymentInfo = Subscription.paymentInfo;
          this.setState(
            {
              subscriptionInfo: subscriptionInfo,
              orderInfo: orderInfo,
              recentOrderList: recentOrderList,
              goodsInfo: goodsInfo,
              paymentInfo: paymentInfo,
              petsId: Subscription.petsId,
              deliveryAddressId: Subscription.deliveryAddressId,
              deliveryAddressInfo: Subscription.consignee,
              billingAddressId: Subscription.billingAddressId,
              billingAddressInfo: Subscription.invoice,
              promotionCode: Subscription.promotionCode,
              noStartOrder: Subscription.noStartTradeList,
              completedOrder: Subscription.completedTradeList,
              loading: false
            },
            () => {
              this.applyPromationCode(this.state.promotionCode);
              if (Subscription.consignee && Subscription.consignee.cityId) {
                this.getCityNameById([Subscription.consignee.cityId], 'BILLING');
              }
              if (Subscription.invoice && Subscription.invoice.cityId) {
                this.getCityNameById([Subscription.invoice.cityId], 'DELIVERY');
              }
            }
          );
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
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
        if (res.code === Const.SUCCESS_CODE) {
          this.getSubscription(this.state.subscriptionId);
          message.success(<FormattedMessage id="Subscription.OperateSuccessfully" />);
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
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
        if (res.code === Const.SUCCESS_CODE) {
          this.getSubscription(this.state.subscriptionId);
          message.success(<FormattedMessage id="Subscription.OperateSuccessfully" />);
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
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
        if (res.code === Const.SUCCESS_CODE) {
          let petsInfo = res.context.context;
          this.setState({
            petsInfo: petsInfo
          });
        }
      })
      .catch((err) => {});
  };
  addressById = (id: String, type: String) => {
    webapi.addressById(id).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
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
    this.querySysDictionary('Frequency_day');
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'country') {
            this.setState({
              countryArr: res.context.sysDictionaryVOS
            });
            sessionStorage.setItem('dict-country', JSON.stringify(res.context.sysDictionaryVOS));
          }
          if (type === 'Frequency_day') {
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_week')
            );
          }
          if (type === 'Frequency_week') {
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
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
        }
      })
      .catch((err) => {});
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
      if (res.code === Const.SUCCESS_CODE) {
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
      if (goodsInfo[i].subscribeNum && goodsInfo[i].originalPrice) {
        sum += +goodsInfo[i].subscribeNum * +goodsInfo[i].originalPrice;
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
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            deliveryPrice: res.context.deliveryPrice,
            discountsPrice: res.context.discountsPrice,
            promotionCodeShow: res.context.promotionCode,
            promotionDesc: res.context.promotionDesc,
            taxFeePrice: res.context.taxFeePrice ? res.context.taxFeePrice : 0
          });
        }
      })
      .catch((err) => {});
  };
  handleYearChange = (value) => {};
  tabChange = (key) => {};
  getCityNameById = (ids, type) => {
    let params = {
      id: ids
    };
    webapi
      .queryCityById(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'BILLING') {
            if (res.context.systemCityVO[0].cityName) {
              this.setState({
                billingCityName: res.context.systemCityVO[0].cityName
              });
            }
          }
          if (type === 'DELIVERY') {
            if (res.context.systemCityVO[0].cityName) {
              this.setState({
                deliveryCityName: res.context.systemCityVO[0].cityName
              });
            }
          }
        }
      })
      .catch((err) => {});
  };
  getCurrencySymbol = () => {
    let currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : '';
    this.setState({
      currencySymbol
    });
  };

  render() {
    const { title, orderInfo, recentOrderList, subscriptionInfo, goodsInfo, paymentInfo, deliveryAddressInfo, billingAddressInfo, countryArr, operationLog, frequencyList, noStartOrder, completedOrder, deliveryCityName, billingCityName, currencySymbol } = this.state;
    const cartTitle = (
      <div className="cart-title">
        <span>{<FormattedMessage id="Subscription.Subscriptions" />}</span>
        <span className="order-time">{'#' + subscriptionInfo.deliveryTimes}</span>
      </div>
    );
    const cartExtra = (
      <div>
        <Popconfirm placement="topRight" title={<FormattedMessage id="Subscription.AreYouSureDelivery" />} onConfirm={() => this.skipNextDelivery(subscriptionInfo.subscriptionNumber)} okText="Confirm" cancelText="Cancel">
          <Tooltip placement="top" title={<FormattedMessage id="Subscription.SkipNextDelivery" />}>
            <Button type="link" style={{ fontSize: 16 }}>
              {<FormattedMessage id="Subscription.SkipNextDelivery" />}
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
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.List.Product" />
          </span>
        ),
        key: 'Product',
        width: '40%',
        render: (text, record) => (
          <div style={{ display: 'flex' }}>
            <img src={record.goodsPic} className="img-item" style={styles.imgItem} alt="" />
            <span style={{ margin: 'auto 10px' }}>{record.goodsName}</span>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.List.Price" />
          </span>
        ),
        key: 'Price',
        width: '15%',
        render: (text, record) => (
          <div>
            <p style={{ textDecoration: 'line-through' }}>{currencySymbol + record.originalPrice.toFixed(2)}</p>
            <p>{currencySymbol + record.subscribePrice.toFixed(2)}</p>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.List.Quantity" />
          </span>
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
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.List.DeliveryFrequency" />
          </span>
        ),
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
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.List.Total" />
          </span>
        ),
        dataIndex: 'Total',
        key: 'Total',
        width: '15%',
        render: (text, record) => (
          <div>
            <span>{currencySymbol + (+record.subscribeNum * +record.subscribePrice).toFixed(2)}</span>
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
        title: <FormattedMessage id="Subscription.operatorColumns.OperatorType" />,
        dataIndex: 'operatorType',
        key: 'operatorType'
      },
      {
        title: <FormattedMessage id="Subscription.operatorColumns.Operator" />,
        dataIndex: 'operator',
        key: 'operator'
      },
      {
        title: <FormattedMessage id="Subscription.operatorColumns.Time" />,
        dataIndex: 'time',
        key: 'time',
        render: (time) => time && moment(time).format(Const.TIME_FORMAT).toString()
      },
      {
        title: <FormattedMessage id="Subscription.operatorColumns.OperationCategory" />,
        dataIndex: 'operationCategory',
        key: 'operationCategory'
      },
      {
        title: <FormattedMessage id="Subscription.operatorColumns.OperationLog" />,
        dataIndex: 'operationLog',
        key: 'operationLog',
        width: '50%'
      }
    ];

    const columns_no_start = [
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.noStart.Product" />
          </span>
        ),
        key: 'Product',
        width: '20%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img src={item.pic} className="img-item" style={styles.imgItem} alt="" />
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
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.noStart.Quantity" />
          </span>
        ),
        key: 'subscribeNum',
        width: '10%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ height: 80 }} key={index}>
                  <p style={{ paddingTop: 30 }}>X {item.num}</p>
                </div>
              ))}
          </div>
        )
      },
      // {
      //   title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Promotion code</span>,
      //   key: 'promotionCode',
      //   dataIndex: 'promotionCode',
      //   width: '20%',
      //   render: (text, record) => <div>{text}</div>
      // },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.noStart.EnjoyDiscount" />
          </span>
        ),
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? currencySymbol + ' ' + '-' + record.tradePrice.discountsPrice.toFixed(2) : '-'}</div>
      },
      {
        title: (
          <span style={{ fontWeight: 500 }}>
            <FormattedMessage id="Subscription.noStart.Amount" />
          </span>
        ),
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? currencySymbol + ' ' + record.tradePrice.totalPrice.toFixed(2) : '-'}</div>
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.noStart.ShipmentDate" />
          </span>
        ),
        key: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeState && record.tradeState.createTime ? moment(record.tradeState.createTime).format('YYYY-MM-DD') : '-'}</div>
      }
    ];
    const columns_completed = [
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.columnsCompleted.Product" />
          </span>
        ),
        key: 'Product',
        width: '30%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img src={item.pic} style={styles.imgItem} className="img-item" alt="" />
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
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.columnsCompleted.Quantity" />
          </span>
        ),
        key: 'subscribeNum',
        width: '10%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ height: 80 }} key={index}>
                  <p style={{ paddingTop: 30 }}>X {item.num}</p>
                </div>
              ))}
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.columnsCompleted.EnjoyDiscount" />
          </span>
        ),
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? currencySymbol + ' ' + '-' + record.tradePrice.discountsPrice : '-'}</div>
      },
      {
        title: (
          <span style={{ fontWeight: 500 }}>
            <FormattedMessage id="Subscription.columnsCompleted.Amount" />
          </span>
        ),
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? currencySymbol + ' ' + record.tradePrice.totalPrice : '-'}</div>
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.columnsCompleted.ShipmentDate" />
          </span>
        ),
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeState && record.tradeState.createTime ? moment(record.tradeState.createTime).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.columnsCompleted.OrderStatus" />
          </span>
        ),
        key: 'shipmentStatus',
        dataIndex: 'shipmentStatus',
        width: '10%',
        render: (text, record) => <div>{!record.id ? 'Autoship skiped' : record.tradeItems && record.tradeItems[0].deliverStatus ? deliverStatus(record.tradeItems[0].deliverStatus) : '-'}</div>
      },
      {
        title: <FormattedMessage id="Subscription.columnsCompleted.Operation" />,
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <>
            {record.id ? (
              <Link to={'/order-detail/' + record.id}>
                <Tooltip placement="top" title={<FormattedMessage id="Subscription.Details" />}>
                  <a style={styles.edit} className="iconfont iconDetails"></a>
                </Tooltip>
              </Link>
            ) : null}
          </>
        )
      }
    ];

    const columns_foodDispenser_no_start = [
      {
        title: <FormattedMessage id="Subscription.noStar.DeliveryDate" />,
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        render: (text, record) => <div>{record.tradeState && record.tradeState.createTime ? moment(record.tradeState.createTime).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: <FormattedMessage id="Subscription.noStar.Product" />,
        key: 'Product',
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
        title: ' ' // cover last th text align right
      }
    ];

    const columns_foodDispenser_completed = [
      {
        title: <FormattedMessage id="Subscription.completed.DeliveryDate" />,
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        render: (text, record) => <div>{record.tradeState && record.tradeState.createTime ? moment(record.tradeState.createTime).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: <FormattedMessage id="Subscription.completed.Product" />,
        key: 'Product',
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
        title: ' ' // cover last th text align right
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
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          {' '}
          <div className="container-search">
            <Headline title={title} />
            <Row className="subscription-basic-info">
              <Col span={24}>
                <span style={{ fontSize: '16px', color: '#3DB014' }}>{subscriptionInfo.subscriptionStatus}</span>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  {<FormattedMessage id="Subscription.ColSpan.ubscriptionNumberS" />} : <span>{subscriptionInfo.subscriptionNumber}</span>
                </p>
                <p>
                  {<FormattedMessage id="Subscription.ColSpan.SubscriptionDate" />} :<span>{moment(new Date(subscriptionInfo.subscriptionTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
                </p>
                <p>
                  {<FormattedMessage id="Subscription.ColSpan.AuditorID" />} : <span>{subscriptionInfo.presciberID}</span>
                </p>
                <p>
                  {<FormattedMessage id="Subscription.ColSpan.AuditorName" />} : <span>{subscriptionInfo.presciberName}</span>
                </p>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  {<FormattedMessage id="Subscription.ColSpan.ConsumerName" />} : <span>{subscriptionInfo.consumer}</span>
                </p>
                <p>
                  {<FormattedMessage id="Subscription.ColSpan.ConsumerAccount" />} : <span>{subscriptionInfo.consumerAccount}</span>
                </p>
                <p>
                  {<FormattedMessage id="Subscription.ColSpan.ConsumerType" />} : <span>{subscriptionInfo.consumerType}</span>
                </p>
                <p>
                  {<FormattedMessage id="Subscription.ColSpan.PhoneNumber" />} : <span>{subscriptionInfo.phoneNumber}</span>
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
                  <span>
                    <FormattedMessage id="Subscription.ColSpan.Subtotal" />
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + this.subTotal().toFixed(2)}</span>
                </div>

                <div className="flex-between">
                  <span>{this.state.promotionDesc ? this.state.promotionDesc : <FormattedMessage id="Subscription.ColSpan.Promotion" />}</span>
                  <span style={styles.priceStyle}>{currencySymbol + '  -' + (this.state.discountsPrice ? this.state.discountsPrice : 0).toFixed(2)}</span>
                </div>

                <div className="flex-between">
                  <span>
                    <FormattedMessage id="Subscription.ColSpan.Shipping" />
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + (this.state.deliveryPrice ? this.state.deliveryPrice : 0).toFixed(2)}</span>
                </div>
                {+sessionStorage.getItem(cache.TAX_SWITCH) === 0 ? (
                  <div className="flex-between">
                    <span>
                      <FormattedMessage id="Subscription.ColSpan.Tax" />
                    </span>
                    <span style={styles.priceStyle}>{currencySymbol + (this.state.taxFeePrice ? this.state.taxFeePrice : 0).toFixed(2)}</span>
                  </div>
                ) : null}

                <div className="flex-between">
                  <span>
                    <span>
                      <FormattedMessage id="Subscription.ColSpan.Total" />
                    </span>{' '}
                    (<FormattedMessage id="Subscription.ColSpan.IVAInclude" />
                    ):
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + (this.subTotal() - +this.state.discountsPrice + +this.state.deliveryPrice + +this.state.taxFeePrice).toFixed(2)}</span>
                </div>
              </Col>
            </Row>
            <Row className="consumer-info" style={{ marginTop: 20 }}>
              <Col span={8}>
                <Row>
                  <Col span={12}>
                    <label className="info-title">
                      <FormattedMessage id="Subscription.ColSpan.DeliveryAddress" />
                    </label>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.DeliveryAddress.Name" />:{' '}
                    </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.firstName + ' ' + deliveryAddressInfo.lastName : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.DeliveryAddress.CityCountry" />:{' '}
                    </p>
                    <p>{deliveryAddressInfo ? deliveryCityName + ',' + this.getDictValue(countryArr, deliveryAddressInfo.countryId) : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.DeliveryAddress.Address1" />:{' '}
                    </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}</p>
                  </Col>
                </Row>
                <Col span={24}>
                  <p style={{ width: 140 }}>
                    <FormattedMessage id="Subscription.ColSpan.DeliveryAddress.Address2" />:{' '}
                  </p>
                  <p>{deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}</p>
                </Col>
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={12}>
                    <label className="info-title">
                      <FormattedMessage id="Subscription.ColSpan.BillingAddress" />
                    </label>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.BillingAddress.Name" />:{' '}
                    </p>
                    <p>{billingAddressInfo ? billingAddressInfo.firstName + ' ' + billingAddressInfo.lastName : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.BillingAddress.CityCountry" />:{' '}
                    </p>
                    <p>{billingAddressInfo ? billingCityName + ',' + this.getDictValue(countryArr, billingAddressInfo.countryId) : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.BillingAddress.Address1" />:{' '}
                    </p>
                    <p>{billingAddressInfo ? billingAddressInfo.address1 : ''}</p>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.BillingAddress.Address2" />:{' '}
                    </p>
                    <p>{billingAddressInfo ? billingAddressInfo.address2 : ''}</p>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={24}>
                    <label className="info-title">
                      <FormattedMessage id="Subscription.ColSpan.PaymentMethod" />
                    </label>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.PaymentMethod.PaymentMethod" />:{' '}
                    </p>
                    <p>{paymentInfo ? paymentInfo.paymentType : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.ColSpan.PaymentMethod.CardNumber" />:{' '}
                    </p>
                    <p>{paymentInfo && paymentInfo.payuPaymentMethod ? '**** **** **** ' + paymentInfo.payuPaymentMethod.last_4_digits : paymentInfo && paymentInfo.adyenPaymentMethod ? '**** **** **** ' + paymentInfo.adyenPaymentMethod.lastFour : ''}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div className="container-search">
            <Headline
              title={<FormattedMessage id="Subscription.AutoshipOrder" />}
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
              <TabPane tab={<FormattedMessage id="Subscription.NoStart" />} key="noStart">
                <Table rowKey={(record, index) => index.toString()} columns={columns_foodDispenser_no_start} dataSource={noStartOrder} pagination={false}></Table>
              </TabPane>
              <TabPane tab={<FormattedMessage id="Subscription.Completed" />} key="completed">
                <Table
                  rowKey={(record, index) => index.toString()}
                  rowClassName={(record, index) => {
                    let className = 'normal-row';
                    if (!record.id) className = 'disable-row';
                    return className;
                  }}
                  columns={columns_completed}
                  dataSource={completedOrder}
                  pagination={false}
                ></Table>
              </TabPane>
            </Tabs>
            <Row style={styles.backItem}>
              <Collapse>
                <Panel header={<FormattedMessage id="Subscription.operationLog" />} key="1" style={{ paddingRight: 10 }}>
                  <Row>
                    <Col span={24}>
                      <Table rowKey={(record, index) => index.toString()} columns={operatorColumns} dataSource={operationLog} bordered pagination={false} />
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            </Row>
          </div>
        </Spin>
        <div className="bar-button">
          <Button type="primary" onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="Subscription.back" />}
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
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  }
};
