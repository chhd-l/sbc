import React from 'react';
import { Breadcrumb, Tabs, Card, Dropdown, Icon, Menu, Row, Col, Button, Input, Select, message, DatePicker, Table, InputNumber, Collapse, Modal, Radio, Checkbox, Tag, Spin, Tooltip, Popconfirm, Popover, Calendar } from 'antd';
import { StoreProvider } from 'plume2';
import FeedBack from '../subscription-detail/component/feedback';
import DeliveryItem from '../customer-details/component/delivery-item';
import { Headline, BreadCrumb, SelectGroup, Const, cache } from 'qmkit';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from './webapi';
import moment from 'moment';

const Panel = Collapse.Panel;

const { Option } = Select;

const { TabPane } = Tabs;
const { Search } = Input;

const NEW_ADDRESS_TEMPLATE = {
  firstName: '',
  lastName: '',
  consigneeNumber: '',
  postCode: '',
  countryId: null,
  region: '',
  province: '',
  city: '',
  address1: '',
  address2: '',
  entrance: '',
  apartment: '',
  rfc: ''
};

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return <FormattedMessage id="order.notShipped" />;
  } else if (status == 'SHIPPED') {
    return <FormattedMessage id="order.allShipments" />;
  } else if (status == 'PART_SHIPPED') {
    return <FormattedMessage id="order.partialShipment" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="order.invalid" />;
  } else {
    return <FormattedMessage id="order.unknown" />;
  }
};
/**
 * 订单详情
 */
export default class SubscriptionDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Subscription edit',
      subscriptionId: this.props.match.params.subId,
      loading: false,
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
      billingCityArr: [],
      deliveryCityArr: [],
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
      deliveryPrice: 0,
      discountsPrice: '',

      isPromotionCodeValid: false,
      promotionDesc: 'Promotion',
      noStartOrder: [],
      completedOrder: [],
      visibleDate: false,
      currentOrder: {},
      currencySymbol: '',

      // operationLog: []
      showAddressForm: false,
      addressItem: {},
      addressType: 'delivery',
      customerId: ''
    };
  }

  componentDidMount() {
    this.getDict();
    this.getSubscriptionDetail();
    this.getCurrencySymbol();
    // this.getBySubscribeId(this.state.subscriptionId);
  }

  getSubscriptionDetail = () => {
    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionDetail(this.state.subscriptionId)
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
            // frequency: subscriptionDetail.cycleTypeId,
            // frequencyName: subscriptionDetail.frequency,
            nextDeliveryTime: subscriptionDetail.nextDeliveryTime
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

          let subscribeNumArr = [];
          let periodTypeArr = [];
          for (let i = 0; i < goodsInfo.length; i++) {
            subscribeNumArr.push(goodsInfo[i].subscribeNum);
            periodTypeArr.push(goodsInfo[i].periodTypeId);
          }
          let originalParams = {
            billingAddressId: subscriptionDetail.billingAddressId,
            // cycleTypeId: subscriptionInfo.frequency,
            deliveryAddressId: subscriptionDetail.deliveryAddressId,
            subscribeNumArr: subscribeNumArr,
            periodTypeArr: periodTypeArr,
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
              noStartOrder: subscriptionDetail.noStartTradeList,
              completedOrder: subscriptionDetail.completedTradeList,
              loading: false
            },
            () => {
              if (this.state.deliveryAddressInfo && this.state.deliveryAddressInfo.customerId) {
                let customerId = this.state.deliveryAddressInfo.customerId;
                this.getAddressList(customerId, 'DELIVERY');
                this.getAddressList(customerId, 'BILLING');
                this.applyPromotionCode(this.state.promotionCodeShow);
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
        message.error(err.message || 'Unsuccessful');
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

    this.querySysDictionary('Frequency_day');
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
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
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
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
    if (field === 'subscribeNum') {
      data = data.map((item) => {
        if (item.skuId === goodsId) {
          item.subscribeNum = value;
        }
        return item;
      });
    }
    if (field === 'periodTypeId') {
      data = data.map((item) => {
        if (item.skuId === goodsId) {
          item.periodTypeId = value;
        }
        return item;
      });
    }

    this.setState(
      {
        goodsInfo: data
      },
      () => {
        this.applyPromotionCode(this.state.promotionCodeShow);
      }
    );
  };

  updateSubscription = () => {
    const { subscriptionInfo, goodsInfo, deliveryAddressId, billingAddressId, originalParams } = this.state;
    this.setState({
      saveLoading: true
    });
    let subscribeNumArr = [];
    let periodTypeArr = [];
    let validNum = true;
    for (let i = 0; i < goodsInfo.length; i++) {
      if (goodsInfo[i].subscribeNum) {
        subscribeNumArr.push(goodsInfo[i].subscribeNum);
        periodTypeArr.push(goodsInfo[i].periodTypeId);
      } else {
        validNum = false;
        break;
      }
    }
    if (!validNum) {
      this.setState({
        saveLoading: false
      });
      message.error('Please enter the correct quantity and frequency!');
      return;
    }
    let params = {
      billingAddressId: billingAddressId,
      // cycleTypeId: subscriptionInfo.frequency,
      deliveryAddressId: deliveryAddressId,
      goodsItems: goodsInfo,
      nextDeliveryTime: moment(subscriptionInfo.nextDeliveryTime).format('YYYY-MM-DD'),
      subscribeId: subscriptionInfo.subscriptionNumber,
      changeField: '',
      promotionCode: this.state.promotionCodeShow
    };
    let changeFieldArr = [];
    if (params.deliveryAddressId !== originalParams.deliveryAddressId) {
      changeFieldArr.push('Delivery Address');
    }
    // if (params.cycleTypeId !== originalParams.cycleTypeId) {
    //   changeFieldArr.push('Frequency');
    // }
    if (params.billingAddressId !== originalParams.billingAddressId) {
      changeFieldArr.push('Billing Address');
    }
    if (params.nextDeliveryTime !== originalParams.nextDeliveryTime) {
      changeFieldArr.push('Next Delivery Time');
    }
    if ((params.promotionCode ? params.promotionCode : '') !== (originalParams.promotionCode ? originalParams.promotionCode : '')) {
      changeFieldArr.push('Promotion Code');
    }
    if (subscribeNumArr.join(',') !== originalParams.subscribeNumArr.join(',')) {
      changeFieldArr.push('Order Quantity');
    }
    if (periodTypeArr.join(',') !== originalParams.periodTypeArr.join(',')) {
      changeFieldArr.push('Frequency');
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
          message.success('Operate successfully');
          this.getSubscriptionDetail();
        } else {
          this.setState({
            saveLoading: false
          });
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        this.setState({
          saveLoading: false
        });
        message.error(err.message || 'Unsuccessful');
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
      }
    }
    return id;
  };
  getCityName = (address) => {
    if (!address.city && !address.cityId) {
      return '';
    }
    if (address.city) {
      return address.city;
    }
    const { deliveryCityArr, billingCityArr } = this.state;
    let list = [];
    list = list.concat(deliveryCityArr, billingCityArr);
    if (list && list.length > 0) {
      let item = list.find((item) => {
        return item.id === address.cityId;
      });
      if (item) {
        return item.cityName;
      }
    }
    return '';
  };

  getAddressList = (customerId, type, showModal = false) => {
    webapi.getAddressListByType(customerId, type).then((data) => {
      const res = data.res;
      if (res.code === 'K-000000') {
        let addressList = res.context.customerDeliveryAddressVOList;
        let customerAccount = res.context.customerAccount;

        if (type === 'DELIVERY') {
          addressList = this.selectedOnTop(addressList, this.state.deliveryAddressId);
          let cityIds = [];
          for (let i = 0; i < addressList.length; i++) {
            if (addressList[i].cityId) {
              cityIds.push(addressList[i].cityId);
            }
          }
          this.getCityNameById(cityIds, 'DELIVERY');
          this.setState({
            deliveryList: addressList,
            customerAccount: customerAccount,
            customerId: customerId,
            visibleShipping: showModal,
            loading: false
          });
        }
        if (type === 'BILLING') {
          addressList = this.selectedOnTop(addressList, this.state.billingAddressId);
          let cityIds = [];
          for (let i = 0; i < addressList.length; i++) {
            if (addressList[i].cityId) {
              cityIds.push(addressList[i].cityId);
            }
          }
          this.getCityNameById(cityIds, 'BILLING');

          this.setState({
            billingList: addressList,
            customerAccount: customerAccount,
            visibleBilling: showModal,
            loading: false
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
    webapi.calcShippingFee(deliveryAddressId);
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
    let date = new Date(sessionStorage.getItem('defaultLocalDateTime'));
    date.setDate(date.getDate() + 3);
    return endValue.valueOf() <= date.valueOf();
  };
  defaultValue = (nextDeliveryTime) => {
    let current = new Date(nextDeliveryTime);
    let normal = new Date(sessionStorage.getItem('defaultLocalDateTime'));
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
      if (goodsInfo[i].subscribeNum && goodsInfo[i].originalPrice) {
        sum += +goodsInfo[i].subscribeNum * +goodsInfo[i].originalPrice;
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
        this.applyPromotionCode();
      }
    );
  };
  applyPromotionCode = (promotionCode?: String) => {
    const { goodsInfo, promotionCodeInput } = this.state;
    this.setState({
      loading: true
    });
    let goodsInfoList = [];
    for (let i = 0; i < goodsInfo.length; i++) {
      let goods = {
        goodsInfoId: goodsInfo[i].skuId,
        buyCount: goodsInfo[i].subscribeNum,
        periodTypeId: goodsInfo[i].periodTypeId,
        goodsInfoFlag: 1
      };
      goodsInfoList.push(goods);
    }
    let params = {
      totalPrice: this.subTotal(),
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
            promotionCodeShow: res.context.promotionCode,
            isPromotionCodeValid: res.context.promotionFlag,
            promotionDesc: res.context.promotionDesc,
            loading: false
          });
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

  handleYearChange = (value) => {};
  tabChange = (key) => {};
  cancelNextSubscription = (row) => {
    let goodsItems = [];
    if (row && row.tradeItems) {
      for (let i = 0; i < row.tradeItems.length; i++) {
        let item = {
          skuId: row.tradeItems[i].skuId
        };
        goodsItems.push(item);
      }
    }

    let params = {
      subscribeId: this.state.subscriptionId,
      changeField: 'Delivery Time',
      goodsList: goodsItems
    };
    this.setState({
      loading: true
    });
    webapi
      .cancelNextSubscription(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getSubscriptionDetail();
          message.success('Operation successful');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };
  updateNextDeliveryTime = (date) => {
    const { currentOrder } = this.state;
    let goodsItems = [];
    if (currentOrder && currentOrder.tradeItems) {
      for (let i = 0; i < currentOrder.tradeItems.length; i++) {
        let item = {
          skuId: currentOrder.tradeItems[i].skuId
        };
        goodsItems.push(item);
      }
    }

    let params = {
      subscribeId: this.state.subscriptionId,
      nextDeliveryTime: date ? moment(date).format('YYYY-MM-DD') : '',
      changeField: 'Delivery Time',
      goodsItems: goodsItems
    };
    this.setState({
      visibleDate: false,
      loading: true
    });
    webapi
      .updateNextDeliveryTime(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getSubscriptionDetail();
          message.success('Operation successful');
        } else {
          this.setState({
            loading: false
          });
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        message.error(err.toString() || 'Operation failure');
      });
  };

  handleVisibleDateChange = (record) => {
    const { visibleDate } = this.state;
    this.setState({
      visibleDate: !visibleDate,
      currentOrder: record
    });
  };
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
            let billingCityArr = [];
            if (res.context.systemCityVO) {
              billingCityArr = res.context.systemCityVO;
            }
            this.setState({
              billingCityArr
            });
          }
          if (type === 'DELIVERY') {
            let deliveryCityArr = [];
            if (res.context.systemCityVO) {
              deliveryCityArr = res.context.systemCityVO;
            }
            this.setState({
              deliveryCityArr
            });
          }
        } else {
          message.error(res.message || 'Operation failure');
        }
      })
      .catch((err) => {
        message.error(err.toString() || 'Operation failure');
      });
  };
  getCurrencySymbol = () => {
    let currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : '';
    this.setState({
      currencySymbol
    });
  };

  onOpenAddressForm = (addressItem: any, type: string) => {
    this.setState({
      showAddressForm: true,
      addressItem: addressItem,
      addressType: type,
      visibleBilling: false,
      visibleShipping: false
    });
  };

  backToSubscriptionEdit = (refreshAddressList: boolean = true) => {
    if (refreshAddressList) {
      this.setState(
        {
          loading: true,
          showAddressForm: false
        },
        () => {
          if (this.state.addressType === 'delivery') {
            this.getAddressList(this.state.customerId, 'DELIVERY', true);
          } else {
            this.getAddressList(this.state.customerId, 'BILLING', true);
          }
        }
      );
    } else {
      this.setState({
        showAddressForm: false,
        [this.state.addressType === 'delivery' ? 'visibleShipping' : 'visibleBilling']: true
      });
    }
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
      deliveryList,
      billingList,
      title,
      noStartOrder,
      completedOrder,
      currentOrder,
      currencySymbol
      // operationLog
    } = this.state;
    const menu = (
      <Menu>
        {recentOrderList.map((item) => (
          <Menu.Item key={item.recentOrderId}>
            <Link to={'/order-detail/' + item.recentOrderId}>{item.recentOrderId + '(' + item.orderStatus + ')'}</Link>
          </Menu.Item>
        ))}
      </Menu>
    );
    // const cartExtra = (
    //   <Button type="link"  style={{fontSize:16,}}>Skip Next Delivery</Button>
    // );
    const columns = [
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Product</span>,
        key: 'Product',
        width: '30%',
        render: (text, record) => (
          <div style={{ display: 'flex' }}>
            <img src={record.goodsPic} className="img-item" alt="" />
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
            <p style={{ textDecoration: 'line-through' }}>{currencySymbol + ' ' + record.originalPrice.toFixed(2)}</p>
            <p>{currencySymbol + ' ' + record.subscribePrice.toFixed(2)}</p>
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Quantity</span>,
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
                this.onGoodsChange({
                  field: 'subscribeNum',
                  goodsId: record.skuId,
                  value
                });
              }}
              value={record.subscribeNum}
            />
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Delivery frequency</span>,
        dataIndex: 'frequency',
        key: 'frequency',
        width: '15%',
        render: (text, record) => (
          <div>
            <Select
              style={{ width: '70%' }}
              value={record.periodTypeId}
              onChange={(value) => {
                value = value === '' ? null : value;
                this.onGoodsChange({
                  field: 'periodTypeId',
                  goodsId: record.skuId,
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
            {/* <InputNumber
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
            /> */}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Subtotal</span>,
        dataIndex: 'Total',
        key: 'Total',
        width: '15%',
        render: (text, record) => (
          <div>
            <span>{currencySymbol + ' ' + (+record.subscribeNum * +record.originalPrice).toFixed(2)}</span>
          </div>
        )
      }
    ];
    const content = (
      <div style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Calendar
          fullscreen={false}
          headerRender={({ value, onChange }) => {
            const start = 0;
            const end = 12;
            const monthOptions = [];

            const current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i++) {
              current.month(i);
              months.push(localeData.monthsShort(current));
            }

            for (let index = start; index < end; index++) {
              monthOptions.push(
                <Select.Option className="month-item" key={`${index}`}>
                  {months[index]}
                </Select.Option>
              );
            }
            const month = value.month();

            const year = value.year();
            const options = [];
            for (let i = year; i < year + 10; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>
              );
            }
            return (
              <div style={{ padding: 10 }}>
                <div style={{ marginBottom: '10px' }}>Custom header </div>
                <Row type="flex" justify="space-between">
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      className="my-year-select"
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                      }}
                      value={String(year)}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={String(month)}
                      onChange={(selectedMonth) => {
                        const newValue = value.clone();
                        newValue.month(parseInt(selectedMonth, 10));
                        onChange(newValue);
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                </Row>
              </div>
            );
          }}
          disabledDate={this.disabledStartDate}
          defaultValue={currentOrder && currentOrder.tradeState && currentOrder.tradeState.createTime ? moment(currentOrder.tradeState.createTime) : moment()}
          onSelect={this.updateNextDeliveryTime}
        />
      </div>
    );

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
                  <img src={item.pic} className="img-item" alt="" />
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
      //   width: '20%',
      //   render: (text, record) => (
      //     <div>
      //       <Search placeholder="Promotion code" enterButton="Apply" onSearch={(value) => console.log(value)} />
      //     </div>
      //   )
      // },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Enjoy discount</span>,
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? currencySymbol + ' ' + '-' + record.tradePrice.discountsPrice.toFixed(2) : '-'}</div>
      },
      {
        title: <span style={{ fontWeight: 500 }}>Amount</span>,
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? currencySymbol + ' ' + record.tradePrice.totalPrice.toFixed(2) : '-'}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Shipment date</span>,
        key: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeState && record.tradeState.createTime ? moment(record.tradeState.createTime).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: 'Operation',
        dataIndex: '',
        width: '10%',
        key: 'x',
        render: (text, record) => (
          <div>
            <Popover content={content} trigger="click" visible={this.state.visibleDate} onVisibleChange={() => this.handleVisibleDateChange(record)}>
              <Tooltip placement="top" title="Select Date">
                <a style={styles.edit} className="iconfont icondata"></a>
              </Tooltip>
            </Popover>
            ,
            <Popconfirm
              placement="topLeft"
              title="Are you sure to skip this item?"
              onConfirm={() => {
                this.cancelNextSubscription(record);
              }}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Tooltip placement="top" title="Skip delivery">
                <a className="iconfont iconskip"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
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
              record.tradeItems.map((item) => (
                <div style={{ display: 'flex' }}>
                  <img src={item.pic} className="img-item" alt="" />
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
                <div style={{ height: 80 }} key={index}>
                  <p style={{ paddingTop: 30 }}>X {item.num}</p>
                </div>
              ))}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Enjoy discount</span>,
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? currencySymbol + ' ' + '-' + record.tradePrice.discountsPrice : '-'}</div>
      },
      {
        title: <span style={{ fontWeight: 500 }}>Amount</span>,
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? currencySymbol + ' ' + record.tradePrice.totalPrice : '-'}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Shipment date</span>,
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeState && record.tradeState.createTime ? moment(record.tradeState.createTime).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}>Order status</span>,
        key: 'shipmentStatus',
        dataIndex: 'shipmentStatus',
        width: '10%',
        render: (text, record) => <div>{!record.id ? 'Autoship skiped' : record.tradeItems && record.tradeItems[0].deliverStatus ? deliverStatus(record.tradeItems[0].deliverStatus) : '-'}</div>
      },
      {
        title: 'Operation',
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <>
            {record.id ? (
              <Link to={'/order-detail/' + record.id}>
                <Tooltip placement="top" title="Details">
                  <a style={styles.edit} className="iconfont iconDetails"></a>
                </Tooltip>
              </Link>
            ) : null}
          </>
        )
      }
    ];

    if (this.state.showAddressForm) {
      return (
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.backToSubscriptionEdit(false);
                }}
              >
                <FormattedMessage id="subscription.edit" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.addressType === 'delivery' ? 'Delivery information' : 'Billing information'}</Breadcrumb.Item>
          </BreadCrumb>
          <DeliveryItem customerId={this.state.customerId} delivery={this.state.addressItem} addressType={this.state.addressType} backToDetail={this.backToSubscriptionEdit} />
        </div>
      );
    }

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{<FormattedMessage id="subscription.edit" />}</Breadcrumb.Item>
        </BreadCrumb>
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          {' '}
          <div className="container-search">
            <Headline title={title} />
            {/* subscription 基本信息 */}
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
                  Auditor ID : <span>{subscriptionInfo.presciberID}</span>
                </p>
                <p>
                  Auditor Name : <span>{subscriptionInfo.presciberName}</span>
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
                  <span style={styles.priceStyle}>{currencySymbol + ' ' + this.subTotal().toFixed(2)}</span>
                </div>
                <div className="flex-between">
                  <span>Promotion</span>
                  <span style={styles.priceStyle}>{currencySymbol + ' ' + (this.state.discountsPrice ? this.state.discountsPrice : 0).toFixed(2)}</span>
                </div>
                {/* <div className="flex-between">
                      <span>Promotion Code</span>
                      {promotionCodeShow ? (
                        <Tag
                          closable
                          onClose={() => this.removePromotionCode()}
                        >
                          {promotionCodeShow}
                        </Tag>
                      ) : null}
                    </div> */}
                <div className="flex-between">
                  <span>Shipping</span>
                  <span style={styles.priceStyle}>{currencySymbol + ' ' + (this.state.deliveryPrice ? this.state.deliveryPrice : 0).toFixed(2)}</span>
                </div>
                <div className="flex-between">
                  <span>
                    <span>Total</span> (IVA Include):
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + ' ' + (this.subTotal() - +this.state.discountsPrice + +this.state.deliveryPrice).toFixed(2)}</span>
                </div>
              </Col>
            </Row>

            <Row className="consumer-info" style={{ marginTop: 20 }}>
              <Col span={8}>
                <Row>
                  <Col span={12}>
                    <label className="info-title">Delivery Address</label>
                  </Col>

                  <Col span={12}>
                    <Tooltip placement="top" title="Change">
                      <a style={styles.edit} onClick={() => this.deliveryOpen()} className="iconfont iconEdit"></a>
                    </Tooltip>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}>Name: </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.firstName + ' ' + deliveryAddressInfo.lastName : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>City,Country: </p>
                    <p>{this.getCityName(deliveryAddressInfo) + ',' + this.getDictValue(countryArr, deliveryAddressInfo.countryId)}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>Address1: </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>Address2: </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}</p>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={12}>
                    <label className="info-title">Billing Address</label>
                  </Col>
                  <Col span={12}>
                    <Tooltip placement="top" title="Change">
                      <a style={styles.edit} onClick={() => this.billingOpen()} className="iconfont iconEdit"></a>
                    </Tooltip>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}>Name: </p>
                    <p>{billingAddressInfo ? billingAddressInfo.firstName + ' ' + billingAddressInfo.lastName : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>City,Country: </p>
                    <p>{billingAddressInfo ? this.getCityName(billingAddressInfo) + ',' + this.getDictValue(countryArr, billingAddressInfo.countryId) : ''}</p>
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
                    <p>{paymentInfo && paymentInfo.payuPaymentMethod ? '**** **** **** ' + paymentInfo.payuPaymentMethod.last_4_digits : paymentInfo && paymentInfo.adyenPaymentMethod ? '**** **** **** ' + paymentInfo.adyenPaymentMethod.lastFour : ''}</p>
                  </Col>
                </Row>
              </Col>
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
              <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: 10 }}>
                <Col>
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
                </Col>
                <Col>
                  <Button size="small" type="primary" onClick={() => this.onOpenAddressForm(NEW_ADDRESS_TEMPLATE, 'delivery')}>
                    Add new
                  </Button>
                </Col>
              </Row>
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
                      <Card style={{ width: 472, marginBottom: 10 }} bodyStyle={{ padding: 10 }} key={item.deliveryAddressId}>
                        <Radio value={item.deliveryAddressId}>
                          <div style={{ display: 'inline-grid' }}>
                            <p>{item.firstName + item.lastName}</p>
                            <p>{this.getCityName(item) + ',' + this.getDictValue(countryArr, item.countryId)}</p>
                            <p>{item.address1}</p>
                            <p>{item.address2}</p>
                          </div>
                        </Radio>
                        <div>
                          <Button type="link" size="small" onClick={() => this.onOpenAddressForm({ ...NEW_ADDRESS_TEMPLATE, ...item }, 'delivery')}>
                            Edit
                          </Button>
                        </div>
                      </Card>
                    ))
                  : deliveryList.map((item, index) =>
                      index < 2 ? (
                        <Card style={{ width: 472, marginBottom: 10 }} bodyStyle={{ padding: 10 }} key={item.deliveryAddressId}>
                          <Radio value={item.deliveryAddressId}>
                            <div style={{ display: 'inline-grid' }}>
                              <p>{item.firstName + item.lastName}</p>
                              <p>{this.getCityName(item) + ',' + this.getDictValue(countryArr, item.countryId)}</p>
                              <p>{item.address1}</p>
                              <p>{item.address2}</p>
                            </div>
                          </Radio>
                          <div>
                            <Button type="link" size="small" onClick={() => this.onOpenAddressForm({ ...NEW_ADDRESS_TEMPLATE, ...item }, 'delivery')}>
                              Edit
                            </Button>
                          </div>
                        </Card>
                      ) : null
                    )}
              </Radio.Group>
              {this.state.isUnfoldedDelivery || deliveryList.length <= 2 ? null : (
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
              <div style={{ marginBottom: 10, textAlign: 'right' }}>
                <Button size="small" type="primary" onClick={() => this.onOpenAddressForm(NEW_ADDRESS_TEMPLATE, 'billing')}>
                  Add new
                </Button>
              </div>
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
                      <Card style={{ width: 472, marginBottom: 10 }} bodyStyle={{ padding: 10 }} key={item.deliveryAddressId}>
                        <Radio value={item.deliveryAddressId}>
                          <div style={{ display: 'inline-grid' }}>
                            <p>{item.firstName + item.lastName}</p>
                            <p>{this.getDictValue(countryArr, item.countryId) + ',' + this.getCityName(item)}</p>
                            <p>{item.address1}</p>
                            <p>{item.address2}</p>
                          </div>
                        </Radio>
                        <div>
                          <Button type="link" size="small" onClick={() => this.onOpenAddressForm({ ...NEW_ADDRESS_TEMPLATE, ...item }, 'billing')}>
                            Edit
                          </Button>
                        </div>
                      </Card>
                    ))
                  : billingList.map((item, index) =>
                      index < 2 ? (
                        <Card style={{ width: 472, marginBottom: 10 }} bodyStyle={{ padding: 10 }} key={item.deliveryAddressId}>
                          <Radio value={item.deliveryAddressId}>
                            <div style={{ display: 'inline-grid' }}>
                              <p>{item.firstName + item.lastName}</p>
                              <p>{this.getDictValue(countryArr, item.countryId) + ',' + this.getCityName(item)}</p>
                              <p>{item.address1}</p>
                              <p>{item.address2}</p>
                            </div>
                          </Radio>
                          <div>
                            <Button type="link" size="small" onClick={() => this.onOpenAddressForm({ ...NEW_ADDRESS_TEMPLATE, ...item }, 'billing')}>
                              Edit
                            </Button>
                          </div>
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
          </div>
          <div className="container-search" style={{ marginBottom: 20 }}>
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
          </div>
          <FeedBack subscriptionId={this.state.subscriptionId} />
          <div className="bar-button">
            <Button type="primary" onClick={() => this.updateSubscription()} loading={this.state.saveLoading}>
              {<FormattedMessage id="save" />}
            </Button>
            <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
              {<FormattedMessage id="back" />}
            </Button>
          </div>
        </Spin>
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
