import React from 'react';
import { Breadcrumb, Tabs, Card, Menu, Row, Col, Button, Input, Select, message, Table, InputNumber, DatePicker, Modal, Radio, Checkbox, Spin, Tooltip, Popconfirm, Popover, Calendar } from 'antd';
import FeedBack from '../subscription-detail/component/feedback';
import DeliveryItem from '../customer-details/component/delivery-item';
import { Headline, Const, cache, AuthWrapper, getOrderStatusValue, RCi18n } from 'qmkit';
import { PostalCodeMsg } from 'biz';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from './webapi';
import moment from 'moment';
import PickupDelivery from '../customer-details/component/pickup-delivery'
import PaymentMethod from './component/payment-method'

import { addAddress, updateAddress } from '../customer-details/webapi';

const { Option } = Select;
const { TabPane } = Tabs;
const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId || '';

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

/**
 * 订单详情
 */
export default class SubscriptionDetail extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pickupIsOpen: false, // pickup开关
      title: 'Subscription edit',
      subscriptionId: this.props.match.params.subId,
      loading: false,
      orderInfo: {},
      subscriptionInfo: {},
      subscriptionType: '',
      recentOrderList: [],
      frequencyList: [],
      individualFrequencyList: [],
      frequencyClubList: [],
      goodsInfo: [],
      petsId: '',
      petsInfo: {},
      paymentInfo: null,
      deliveryAddressId: '',
      deliveryAddressInfo: {},
      billingAddressId: '',
      billingAddressInfo: {},
      visibleShipping: false,
      pickupLoading: false,
      visibleBilling: false,
      visiblePetInfo: false,
      countryArr: [],
      billingCityArr: [],
      deliveryCityArr: [],
      allAddressList: [],
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
      taxFeePrice: 0,
      discountsPrice: '',
      freeShippingFlag: false,
      freeShippingDiscountPrice: 0,
      subscriptionDiscountPrice: 0,
      promotionVOList: [],

      isPromotionCodeValid: false,
      promotionDesc: 'Promotion',
      noStartOrder: [],
      completedOrder: [],
      visibleDate: false,
      currentOrder: {},
      currencySymbol: '',
      currentDateId: '',

      showAddressForm: false,
      addressLoading: false,
      addressItem: {},
      addressType: 'delivery',
      customerId: '',
      paymentMethodVisible: false,
      paymentId: '',
      payPspItemEnum: '',
      paymentMethod: '',

      addOrEditPickup: false,
      deliveryType: 'homeDelivery',
      defaultCity: '',
      pickupEditNumber: 0,
      pickupAddress: null,
      pickupFormData: [], // pickup 表单数据
      confirmPickupDisabled: true, // pickup地址确认按钮状态
      subscribeGoods: null, // 订阅商品数据，传给pickup组件

      deliveryDate: undefined,
      timeSlot: undefined,
      deliveryDateList: [],
      timeSlotList: []
    };
  }

  componentDidMount() {
    this.getDict();
    this.getSubscriptionDetail();
    this.getCurrencySymbol();

    let pickupIsOpen = JSON.parse(sessionStorage.getItem('portal-pickup-isopen')) || null;
    if (pickupIsOpen) {
      this.setState({
        pickupIsOpen
      })
    }
  }

  getSubscriptionDetail = () => {
    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionDetail(this.state.subscriptionId)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let subscriptionDetail = res.context;
          let subscriptionInfo = {
            deliveryTimes: subscriptionDetail.deliveryTimes,
            subscriptionStatus: subscriptionDetail.subscribeStatus === '0' ? RCi18n({ id: "Subscription.Active" }) : subscriptionDetail.subscribeStatus === '1' ? RCi18n({ id: "Subscription.Pause" }) : RCi18n({ id: "Subscription.Inactive" }),
            subscriptionNumber: subscriptionDetail.subscribeId,
            subscriptionTime: subscriptionDetail.createTime,
            presciberID: subscriptionDetail.prescriberId,
            presciberName: subscriptionDetail.prescriberName,
            consumer: subscriptionDetail.customerName,
            consumerAccount: subscriptionDetail.customerAccount,
            consumerType: subscriptionDetail.customerType,
            phoneNumber: subscriptionDetail.customerPhone,
            nextDeliveryTime: subscriptionDetail.nextDeliveryTime,
            customerId: subscriptionDetail.customerId
          };
          let orderInfo = {
            recentOrderId: subscriptionDetail.trades ? subscriptionDetail.trades[0].id : '',
            orderStatus: subscriptionDetail.trades ? subscriptionDetail.trades[0].tradeState.flowState : ''
          };
          let recentOrderList = [];
          if (subscriptionDetail.trades) {
            for (let i = 0; i < subscriptionDetail.trades.length; i++) {
              let recentOrder = {
                recentOrderId: subscriptionDetail.trades[i].id,
                orderStatus: subscriptionDetail.trades[i].tradeState.flowState
              };
              recentOrderList.push(recentOrder);
            }
          }

          let goodsInfo = subscriptionDetail.goodsInfo;
          let paymentInfo = subscriptionDetail.payPaymentInfo;
          let paymentMethod = subscriptionDetail.paymentMethod

          let subscribeGoods = [];
          let subscribeNumArr = [];
          let periodTypeArr = [];
          for (let i = 0; i < goodsInfo.length; i++) {
            let ginfo = goodsInfo[i];
            subscribeNumArr.push(ginfo.subscribeNum);
            periodTypeArr.push(ginfo.periodTypeId);
            
            // 组装订阅商品goodsInfoId和数量
            let goodsInfoId = ginfo?.goodsInfoVO?.goodsInfoId;
            subscribeGoods.push({
              goodsInfoId: goodsInfoId,
              quantity: ginfo.subscribeNum
            });
          }
          let originalParams = {
            billingAddressId: subscriptionDetail.billingAddressId,
            deliveryAddressId: subscriptionDetail.deliveryAddressId,
            subscribeNumArr: subscribeNumArr,
            periodTypeArr: periodTypeArr,
            nextDeliveryTime: subscriptionInfo.nextDeliveryTime,
            promotionCode: subscriptionDetail.promotionCode
          };
          console.log('666 >>> subscribeGoods: ', subscribeGoods);
          this.setState(
            {
              subscribeGoods: subscribeGoods,
              subscriptionType: subscriptionDetail.subscriptionType,
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
              paymentMethod: paymentMethod,
              deliveryDate: subscriptionDetail.consignee.deliveryDate,
              timeSlot: subscriptionDetail.consignee.timeSlot,
            },
            () => {
              if (this.state.deliveryAddressInfo && this.state.deliveryAddressInfo.customerId) {
                let customerId = this.state.deliveryAddressInfo.customerId;
                this.getAddressList(customerId, 'DELIVERY');
                this.getAddressList(customerId, 'BILLING');
                this.applyPromotionCode(this.state.promotionCodeShow);
                if (subscriptionDetail.consignee.receiveType === 'HOME_DELIVERY' && +storeId === 123457907) {
                  this.getTimeSlot({ cityNo: subscriptionDetail.consignee.cityIdStr, subscribeId: subscriptionInfo.subscriptionNumber })
                }
              }
            }
          );
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false
        });
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
        if (res.code === Const.SUCCESS_CODE) {
          let petsInfo = res.context.context;
          this.setState({
            petsInfo: petsInfo
          });
        }
      })
      .catch(() => { });
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
    this.querySysDictionary('Frequency_day_club');
    this.querySysDictionary('Frequency_day_individual');
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {

          // Individualization Frequency
          if (type == 'Frequency_day_individual') {
            // Frequency_month_individual
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState({
              individualFrequencyList: frequencyList
            });
          }

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
          if (type === 'Frequency_day_club') {
            let frequencyClubList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyClubList: frequencyClubList
              },
              () => this.querySysDictionary('Frequency_week_club')
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
          if (type === 'Frequency_week_club') {
            let frequencyClubList = [...this.state.frequencyClubList, ...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyClubList: frequencyClubList
              },
              () => this.querySysDictionary('Frequency_month_club')
            );
          }
          if (type === 'Frequency_month') {
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
            this.setState({
              frequencyList: frequencyList
            });
          }
          if (type === 'Frequency_month_club') {
            let frequencyClubList = [...this.state.frequencyClubList, ...res.context.sysDictionaryVOS];
            this.setState({
              frequencyClubList: frequencyClubList
            });
          }
        } else {
        }
      })
      .catch(() => { });
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
    const { subscriptionInfo,
      goodsInfo,
      deliveryAddressId,
      billingAddressId,
      originalParams,
      deliveryAddressInfo,
      deliveryDateList,
      timeSlotList,
      deliveryDate,
      timeSlot } = this.state;
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
      message.error(RCi18n({ id: "Subscription.quantityAndFrequency" }));
      return;
    }
    //俄罗斯 HOME_DELIVERY 如果deliveryDateList 有值,
    if (+storeId === 123457907 && deliveryAddressInfo.receiveType === 'HOME_DELIVERY' && deliveryDateList.length > 0) {
      //deliveryDate 没有选择 报错
      if (!deliveryDate) {
        message.error(RCi18n({ id: "Subscription.MissDeliveryDateTip" }))
        return;
      }
      // timeSlotList存在，但是timeSlot没有值 报错
      if (timeSlotList && !timeSlot) {
        message.error(RCi18n({ id: "Subscription.MissTimeSlotTip" }))
        return;
      }
    }

    let params = {
      billingAddressId: billingAddressId,
      // cycleTypeId: subscriptionInfo.frequency,
      deliveryAddressId: deliveryAddressId,
      goodsItems: goodsInfo,
      nextDeliveryTime: moment(subscriptionInfo.nextDeliveryTime).format('YYYY-MM-DD'),
      subscribeId: subscriptionInfo.subscriptionNumber,
      changeField: '',
      promotionCode: this.state.promotionCodeShow,
      paymentId: this.state.paymentId,
      payPspItemEnum: this.state.payPspItemEnum,
      deliveryDate: deliveryDate,
      timeSlot: timeSlot
    };
    let changeFieldArr = [];
    if (params.deliveryAddressId !== originalParams.deliveryAddressId) {
      changeFieldArr.push('Delivery Address');
    }
    // if (params.cycleTypeId !== originalParams.cycleTypeId) {
    //   changeFieldArr.push('Frequency');
    //
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
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            saveLoading: false,
            payPspItemEnum: '',
          });
          message.success(RCi18n({ id: 'Subscription.OperateSuccessfully' }));
          setTimeout(() => {
            this.getSubscriptionDetail();
          }, 1000);

        } else {
          this.setState({
            saveLoading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          saveLoading: false
        });
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
    const { deliveryAddressInfo, pickupIsOpen } = this.state;
    webapi.getAddressListByType(customerId, type).then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        let allAddress = res.context.customerDeliveryAddressVOList || [];
        let allList = allAddress.filter((addr: any) => addr.type === 'DELIVERY');
        let addressList = allAddress.filter((addr: any) => addr.receiveType !== 'PICK_UP');
        let pickup = allAddress.filter((pk: any) => pk.receiveType === 'PICK_UP');
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
            allAddressList: allList,
            deliveryList: addressList,
            pickupAddress: pickup,
            customerAccount: customerAccount,
            customerId: customerId,
            visibleShipping: showModal
          }, () => {
            // 根据 receiveType 设置默认选中
            let rctype = deliveryAddressInfo?.receiveType || '';
            let dltype = (rctype === 'PICK_UP' && pickupIsOpen) ? 'pickupDelivery' : 'homeDelivery';
            this.setState({
              deliveryType: dltype
            })
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
            visibleBilling: showModal
          });
        }
      }
    });
  };
  selectedOnTop = (addressList, selectedId) => {
    const selectedAddressIdx = addressList.findIndex((item) => {
      return item.deliveryAddressId === selectedId;
    });
    if (selectedAddressIdx > -1) {
      const selectedAddress = addressList[selectedAddressIdx];
      addressList.splice(selectedAddressIdx, 1);
      addressList.splice(0, 0, selectedAddress);
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

  // 修改pickup address
  updatePickupAddress = (params: any) => {
    const { customerId } = this.state;
    updateAddress(params)
      .then((data) => {
        const res = data.res;
        if (res.code === 'K-000000') {
          this.getAddressList(customerId, 'DELIVERY', true);
          message.success(RCi18n({ id: "PetOwner.OperateSuccessfully" }));
        } else {
          message.error(RCi18n({ id: "PetOwner.Unsuccessful" }));
        }
        this.setState({
          addOrEditPickup: false,
          pickupLoading: false,
          visibleShipping: true
        });
      })
      .catch((err) => {
        message.error(RCi18n({ id: "PetOwner.Unsuccessful" }));
        this.setState({
          addOrEditPickup: false,
          pickupLoading: false,
          visibleShipping: true
        });
      });
  };

  // 保存pickup地址
  pickupConfirm = async () => {
    const { deliveryList, pickupAddress, pickupFormData, customerId, countryArr } = this.state;

    let tempPickup = Object.keys(deliveryList[0]).reduce((pre, cur) => {
      return Object.assign(pre, { [cur]: '' });
    }, {});

    let params = Object.assign(tempPickup, pickupFormData, {
      customerId: customerId,
      deliveryAddressId: pickupAddress[0]?.deliveryAddressId || '',
      countryId: countryArr[0].id,
      country: countryArr[0].value,
      consigneeName: pickupFormData.firstName + ' ' + pickupFormData.lastName,
      consigneeNumber: pickupFormData.phoneNumber,
      deliveryAddress: pickupFormData.address1,
      type: 'DELIVERY',
      isDefaltAddress: pickupFormData.isDefaltAddress ? 1 : 0,
    });
    this.setState({
      pickupLoading: true
    });
    if (pickupAddress.length) {
      // 修改地址
      await this.updatePickupAddress(params);
    } else {
      // 添加地址
      const { res } = await addAddress({
        ...params,
        customerId
      });
      if (res.code === Const.SUCCESS_CODE) {
        message.success(RCi18n({ id: "PetOwner.OperateSuccessfully" }));
      } else {
        message.error(RCi18n({ id: "PetOwner.Unsuccessful" }));
      }
      this.setState({
        addOrEditPickup: false,
        pickupLoading: false,
        visibleShipping: true
      }, () => {
        this.getAddressList(customerId, 'DELIVERY', true);
      });
    }
  }

  deliveryOK = async () => {
    const { deliveryList, allAddressList, deliveryAddressId, subscriptionInfo } = this.state;
    let deliveryAddressInfo = allAddressList.find((item: any) => {
      return item.deliveryAddressId === deliveryAddressId;
    });

    // 切换pickup地址时，获取pick point 状态
    if (deliveryAddressInfo.receiveType === 'PICK_UP') {
      await webapi.getPickupPointStatus(deliveryAddressId).then(data => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          deliveryAddressInfo['pickupPointState'] = res.context;
        }
      })
    }

    // 俄罗斯地址验证是否完整 (暂时不判断pickup地址)
    if (deliveryAddressInfo.receiveType !== 'PICK_UP' && (window as any).countryEnum[JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId ?? 0] === 'ru') {
      if (!deliveryAddressInfo.street ||
        !deliveryAddressInfo.postCode ||
        !deliveryAddressInfo.house ||
        !deliveryAddressInfo.city) {
        const errMsg = !deliveryAddressInfo.street
          ? RCi18n({ id: 'PetOwner.AddressStreetTip' })
          : !deliveryAddressInfo.postCode
            ? RCi18n({ id: 'PetOwner.AddressPostCodeTip' })
            : !deliveryAddressInfo.house
              ? RCi18n({ id: 'PetOwner.AddressHouseTip' })
              : RCi18n({ id: 'PetOwner.AddressCityTip' });
        message.error(errMsg);
        return;
      }
      //如果是HOME_DELIVERY 查询timeslot信息
      if (deliveryAddressInfo.receiveType === 'HOME_DELIVERY') {
        this.getTimeSlot({ cityNo: deliveryAddressInfo.cityIdStr, subscribeId: subscriptionInfo.subscriptionNumber })
        this.setState({
          deliveryDate: undefined,
          timeSlot: undefined
        })
      }
    }

    let addressList = this.selectedOnTop(deliveryList, deliveryAddressId);

    //计算运费, 改为从后端getPromotionPirce接口获取
    this.setState({ addressLoading: true });
    // if (await webapi.getAddressInputTypeSetting() === 'AUTOMATICALLY') {
    //   const feeRes = await webapi.calcShippingFee(deliveryAddressInfo.address1);
    //   if (feeRes.res.code === Const.SUCCESS_CODE && feeRes.res.context.success) {
    //     deliveryPrice = feeRes.res.context.tariffs[0]?.deliveryPrice ?? 0
    //   } else {
    //     message.error(<FormattedMessage id="Subscription.shippingArea"/>);
    //     return;
    //   }
    // }

    if (this.state.sameFlag) {
      this.setState({
        addressLoading: false,
        deliveryAddressInfo: deliveryAddressInfo,
        billingAddressInfo: deliveryAddressInfo,
        deliveryList: addressList,
        visibleShipping: false
      });
    } else {
      this.setState({
        addressLoading: false,
        deliveryAddressInfo: deliveryAddressInfo,
        deliveryList: addressList,
        visibleShipping: false
      });
    }
    this.applyPromotionCode();
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

  disabledStartDate = (endValue) => {
    let date = new Date(sessionStorage.getItem('defaultLocalDateTime'));
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
    const { goodsInfo, promotionCodeInput, subscriptionInfo } = this.state;
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
      deliveryAddressId: this.state.deliveryAddressId,
      customerAccount: subscriptionInfo.consumerAccount,
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
            taxFeePrice: res.context.taxFeePrice ? res.context.taxFeePrice : 0,
            isPromotionCodeValid: res.context.promotionFlag,
            promotionDesc: res.context.promotionDesc,
            freeShippingFlag: res.context.freeShippingFlag ?? false,
            freeShippingDiscountPrice: res.context.freeShippingDiscountPrice ?? 0,
            subscriptionDiscountPrice: res.context.subscriptionDiscountPrice ?? 0,
            promotionVOList: res.context.promotionVOList ?? [],
            loading: false
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  handleYearChange = () => { };
  tabChange = () => { };
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
          message.success(RCi18n({ id: "Subscription.OperationSuccessful" }));
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false
        });
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
          message.success(RCi18n({ id: "Subscription.OperationSuccessful" }));
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  handleVisibleDateChange = (record) => {
    const { visibleDate } = this.state;
    this.setState({
      currentDateId: record.tradeItems[0].skuId,
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
          message.error(res.message || RCi18n({ id: "Subscription.OperationFailure" }));
        }
      })
      .catch((err) => {
        message.error(err.toString() || RCi18n({ id: "Subscription.OperationFailure" }));
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

  // 设置价格长度
  getSubscriptionPrice = (num: any) => {
    const { subscriptionType } = this.state;
    if (num > 0) {
      let nlen = num.toString().split('.')[1]?.length;
      // subscriptionType == 'Individualization' ? nlen = 4 : nlen = 2;
      isNaN(nlen) ? 2 : nlen;
      nlen > 4 ? nlen = 4 : nlen = nlen;
      if (subscriptionType === 'Club') {
        nlen = 2;
      }
      return num.toFixed(nlen);
    } else {
      return num;
    }
  }
  getTimeSlot = (params: any) => {
    webapi.getTimeSlot(params).then(data => {
      const { deliveryDate, timeSlot } = this.state
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let deliveryDateList = res.context.timeSlots
        this.setState({
          deliveryDateList: deliveryDateList,
          timeSlotList: deliveryDateList[0].dateTimeInfos || [],
          deliveryDate: deliveryDate ? deliveryDate : deliveryDateList[0] && deliveryDateList[0].date,
          timeSlot: timeSlot ? timeSlot : deliveryDateList[0] &&
            deliveryDateList[0].dateTimeInfos[0].startTime + '-' + deliveryDateList[0].dateTimeInfos[0].endTime
        })
      }
    })
  }

  deliveryDateChange = (value: any) => {
    const { deliveryDateList, deliveryDate, timeSlot } = this.state
    let timeSlots = deliveryDateList.find(item => item.date === value).dateTimeInfos || []
    this.setState({
      deliveryDate: value,
      timeSlotList: timeSlots,
      timeSlot: deliveryDate === value ? timeSlot : undefined
    })
  }
  //timeslot
  timeSlotChange = (value: any) => {
    this.setState({
      timeSlot: value
    })
  }

  // 更新 pickup编辑次数
  updatePickupEditNumber = (num: number) => {
    this.setState({
      pickupEditNumber: num
    });
  };

  // 更新 pickup 按钮状态
  updateConfirmPickupDisabled = (flag: boolean) => {
    this.setState({
      confirmPickupDisabled: flag
    });
  };

  // 更新pickup数据
  updatePickupData = (data: any) => {
    this.setState({
      pickupFormData: data
    });
  };

  render() {
    const {
      pickupIsOpen,
      subscriptionInfo,
      individualFrequencyList,
      frequencyList,
      frequencyClubList,
      goodsInfo,
      paymentInfo,
      deliveryAddressInfo,
      billingAddressInfo,
      countryArr,
      billingList,
      noStartOrder,
      completedOrder,
      currentOrder,
      currencySymbol,
      currentDateId,
      visibleDate,
      subscriptionType,
      paymentMethod,
      deliveryType,
      pickupFormData,
      pickupEditNumber,
      defaultCity,
      addOrEditPickup,
      pickupLoading,
      deliveryList,
      pickupAddress,
      confirmPickupDisabled,
      isUnfoldedDelivery,

      deliveryDate,
      deliveryDateList,
      timeSlotList,
      timeSlot
      // operationLog
    } = this.state;

    // const cartExtra = (
    //   <Button type="link"  style={{fontSize:16,}}>Skip Next Delivery</Button>
    // );

    const columns = [
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.Product" /></span>,
        key: 'Product',
        width: '30%',
        render: (text: any, record: any) => (
          <div style={{ display: 'flex' }}>
            <img src={record.goodsPic} className="img-item" style={styles.imgItem} alt="" />
            <span style={{ margin: 'auto 10px' }}>
              {record.goodsName === 'individualization' ? record.petsName + '\'s personalized subscription' : record.goodsName}
            </span>
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.Price" /></span>,
        key: 'Price',
        width: '15%',
        render: (text: any, record: any) => (
          <div>
            {subscriptionType == 'Individualization' ? null : (
              <p style={{ textDecoration: 'line-through' }}>
                {currencySymbol + ' ' + this.getSubscriptionPrice(record.originalPrice)}
              </p>
            )}
            < p >
              {currencySymbol + ' '}
              {subscriptionType == 'Individualization' ? this.getSubscriptionPrice((+record.subscribeNum * +record.subscribePrice)) : this.getSubscriptionPrice((+record.subscribeNum * +record.subscribePrice))}
              {/* {currencySymbol + ' ' + this.getSubscriptionPrice(record.subscribePrice)} */}
            </p >
          </div >
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.Quantity" /></span>,
        dataIndex: 'subscribeNum',
        key: 'subscribeNum',
        width: '15%',
        render: (text, record) => (
          <div>
            {subscriptionType == 'Individualization' ? 1 : (
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
            )}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.DeliveryFrequency" /></span>,
        dataIndex: 'frequency',
        key: 'frequency',
        width: '15%',
        render: (text: any, record: any) => (
          <div className="subscription_delivery_frequency">
            <Select
              style={{ width: '70%' }}
              value={record.periodTypeId}
              onChange={(value: any) => {
                value = value === '' ? null : value;
                this.onGoodsChange({ field: 'periodTypeId', goodsId: record.skuId, value });
              }}
            >
              {/* individualFrequencyList */}
              {subscriptionType == 'Individualization' ? (
                individualFrequencyList.map((item: any) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))
              ) : (
                ((record.goodsInfoVO?.promotions ?? record.goodsVO?.promotions) === 'club' ? frequencyClubList : frequencyList).map((item: any) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))
              )}
            </Select>
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.Subtotal" /></span>,
        dataIndex: 'Total',
        key: 'Total',
        width: '15%',
        render: (text: any, record: any) => (
          <div>
            <span>{currencySymbol + ' ' + this.getSubscriptionPrice((+record.subscribeNum * +record.originalPrice))}</span>
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
            const startYear = moment().year();
            const options = [];
            for (let i = startYear; i < year + 10; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>
              );
            }
            return (
              <div style={{ padding: 10 }}>
                <div style={{ marginBottom: '10px' }}><FormattedMessage id="Subscription.CustomHeader" /> </div>
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
          defaultValue={currentOrder && currentOrder.tradeItems && currentOrder.tradeItems[0] && currentOrder.tradeItems[0].nextDeliveryTime ? moment(currentOrder.tradeItems[0].nextDeliveryTime) : moment()}
          onSelect={this.updateNextDeliveryTime}
        />
      </div>
    );

    const columns_no_start = [
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.Product" /></span>,
        key: 'Product',
        width: '20%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img src={item.pic} className="img-item" style={styles.imgItem} alt="" />
                  <div style={{ margin: 'auto 10px' }}>
                    <p>{item.skuName === 'individualization' ? item.petsName + '\'s personalized subscription' : item.skuName}</p>
                    <p>{item.specDetails}</p>
                  </div>
                </div>
              ))}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.Quantity" /></span>,
        key: 'subscribeNum',
        width: '10%',
        render: (text, record) => (
          <div>
            {subscriptionType == 'Individualization' ? 1 : (
              record.tradeItems &&
              record.tradeItems.map((item: any, index: any) => (
                <div style={{ height: 80 }} key={index}>
                  <p style={{ paddingTop: 30 }}>X {item.num}</p>
                </div>
              ))
            )}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.EnjoyDiscount" /></span>,
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? currencySymbol + ' ' + '-' + this.getSubscriptionPrice(record.tradePrice.discountsPrice) : '-'}</div>
      },
      {
        title: <span style={{ fontWeight: 500 }}><FormattedMessage id="Subscription.Amount" /></span>,
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? currencySymbol + ' ' + this.getSubscriptionPrice(record.tradePrice.totalPrice) : '-'}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.ShipmentDate" /></span>,
        key: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeItems && record.tradeItems[0].nextDeliveryTime ? moment(record.tradeItems[0].nextDeliveryTime).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: <FormattedMessage id="Subscription.Operation" />,
        dataIndex: '',
        width: '10%',
        key: 'x',
        render: (text, record) => (
          <div>
            <Popover content={content} trigger="click" visible={visibleDate && currentDateId === record.tradeItems[0].skuId} onVisibleChange={() => this.handleVisibleDateChange(record)}>
              <Tooltip placement="top" title={<FormattedMessage id="Subscription.SelectDate" />}>
                <a style={styles.edit} className="iconfont icondata"></a>
              </Tooltip>
            </Popover>
            <Popconfirm
              placement="topLeft"
              title={<FormattedMessage id="Subscription.skipThisItem" />}
              onConfirm={() => {
                this.cancelNextSubscription(record);
              }}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Tooltip placement="top" title={<FormattedMessage id="Subscription.SkipDelivery" />}>
                <a className="iconfont iconskip"></a>
              </Tooltip>
            </Popconfirm>
          </div>
        )
      }
    ];
    const columns_completed = [
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.Product" /></span>,
        key: 'Product',
        width: '30%',
        render: (text: any, record: any) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item: any) => (
                <div style={{ display: 'flex' }}>
                  <img src={item.pic} className="img-item" style={styles.imgItem} alt="" />
                  <div style={{ margin: 'auto 10px' }}>
                    <p>{item.skuName === 'individualization' ? item.petsName + '\'s personalized subscription' : item.skuName}</p>
                    <p>{item.specDetails}</p>
                  </div>
                </div>
              ))}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.Quantity" /></span>,
        key: 'subscribeNum',
        width: '10%',
        render: (text, record) => (
          <div>
            {subscriptionType == 'Individualization' ? 1 : (
              record.tradeItems &&
              record.tradeItems.map((item: any, index: any) => (
                <div style={{ height: 80 }} key={index}>
                  <p style={{ paddingTop: 30 }}>X {item.num}</p>
                </div>
              ))
            )}
          </div>
        )
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.EnjoyDiscount" /></span>,
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? currencySymbol + ' ' + '-' + record.tradePrice.discountsPrice : '-'}</div>
      },
      {
        title: <span style={{ fontWeight: 500 }}><FormattedMessage id="Subscription.Amount" /></span>,
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? currencySymbol + ' ' + record.tradePrice.totalPrice : '-'}</div>
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="order.orderId" />
          </span>
        ),
        key: 'id',
        width: '10%',
        dataIndex: 'id',
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Order.OrderTime" /></span>,
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeState && record.tradeState.createTime ? moment(record.tradeState.createTime).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: <span style={{ color: '#8E8E8E', fontWeight: 500 }}><FormattedMessage id="Subscription.OrderStatus" /></span>,
        key: 'shipmentStatus',
        dataIndex: 'shipmentStatus',
        width: '10%',
        render: (text, record) => <div>{!record.id ? 'Autoship skiped' : record.tradeState && record.tradeState.flowState ?
          <FormattedMessage id={getOrderStatusValue('OrderStatus', record.tradeState.flowState)} />
          // deliverStatus(record.tradeItems[0].deliverStatus)
          : '-'}</div>
      },
      {
        title: <FormattedMessage id="Subscription.Operation" />,
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <>
            {record.id ? (
              <Link to={'/order-detail/' + record.id}>
                <Tooltip placement="top" title={<FormattedMessage id="Subscription.Detail" />}>
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
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/subscription-list">
                <FormattedMessage id="Subscription.Subscription" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/subscription-list">
                <FormattedMessage id="Subscription.SubscriptionList" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  this.backToSubscriptionEdit(false);
                }}
              >
                <FormattedMessage id="Subscription.edit" />
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{this.state.addressType === 'delivery' ? <FormattedMessage id="Subscription.Delivery information" /> : <FormattedMessage id="Subscription.Billing information" />}</Breadcrumb.Item>
          </Breadcrumb>
          <DeliveryItem customerId={this.state.customerId} delivery={this.state.addressItem} addressType={this.state.addressType} backToDetail={this.backToSubscriptionEdit} />
        </div>
      );
    }

    return (
      <div>
        {/* 面包屑 */}
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/subscription-list">
              <FormattedMessage id="Subscription.Subscription" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/subscription-list">
              <FormattedMessage id="Subscription.SubscriptionList" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{<FormattedMessage id="Subscription.edit" />}</Breadcrumb.Item>
        </Breadcrumb>

        <Spin spinning={this.state.loading}>
          {' '}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Subscription.edit" />} />

            {/* subscription 基本信息 */}
            <Row className="subscription-basic-info">
              <Col span={24}>
                <span style={{ fontSize: '16px', color: '#3DB014' }}>{subscriptionInfo.subscriptionStatus}</span>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  <FormattedMessage id="Subscription.SubscriptionNumber" /> : <span>{subscriptionInfo.subscriptionNumber}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.SubscriptionDate" /> :<span>{moment(new Date(subscriptionInfo.subscriptionTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.AuditorID" /> : <span>{subscriptionInfo.presciberID}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.AuditorName" /> : <span>{subscriptionInfo.presciberName}</span>
                </p>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  <FormattedMessage id="Subscription.PetOwnerName" /> : <span>{subscriptionInfo.consumer}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.ConsumerAccount" /> : <span>{subscriptionInfo.consumerAccount}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.ConsumerType" /> : <span>{subscriptionInfo.consumerType}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.PhoneNumber" /> : <span>{subscriptionInfo.phoneNumber}</span>
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
                  <span><FormattedMessage id="Subscription.Subtotal" /></span>
                  <span style={styles.priceStyle}>{currencySymbol + ' ' + this.getSubscriptionPrice(this.subTotal())}</span>
                </div>
                <div className="flex-between">
                  <span><FormattedMessage id="Order.subscriptionDiscount" /></span>
                  <span style={styles.priceStyle}>{currencySymbol + ' -' + this.getSubscriptionPrice((this.state.subscriptionDiscountPrice ? this.state.subscriptionDiscountPrice : 0))}</span>
                </div>
                {this.state.promotionVOList.map((pvo, idx) => (
                  <div key={idx} className="flex-between">
                    <span>{pvo.marketingName}</span>
                    <span style={styles.priceStyle}>{currencySymbol + ' -' + this.getSubscriptionPrice(pvo.discountPrice ? pvo.discountPrice : 0)}</span>
                  </div>
                ))}

                <div className="flex-between">
                  <span><FormattedMessage id="Subscription.Shipping" /></span>
                  <span style={styles.priceStyle}>{currencySymbol + ' ' + this.getSubscriptionPrice(this.state.deliveryPrice ? this.state.deliveryPrice : 0)}</span>
                </div>
                {this.state.freeShippingFlag && <div className="flex-between">
                  <span><FormattedMessage id="Order.shippingFeesDiscount" /></span>
                  <span style={styles.priceStyle}>{currencySymbol + ' -' + this.getSubscriptionPrice(this.state.freeShippingDiscountPrice ? this.state.freeShippingDiscountPrice : 0)}</span>
                </div>}
                {+sessionStorage.getItem(cache.TAX_SWITCH) === 1 ? (
                  <div className="flex-between">
                    <span><FormattedMessage id="Subscription.Tax" /></span>
                    <span style={styles.priceStyle}>{currencySymbol + this.getSubscriptionPrice(this.state.taxFeePrice ? this.state.taxFeePrice : 0)}</span>
                  </div>
                ) : null}
                <div className="flex-between">
                  <span>
                    <span><FormattedMessage id="Subscription.Total" /></span> (<FormattedMessage id="Subscription.IVAInclude" />):
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + ' ' + this.getSubscriptionPrice(this.subTotal() - +this.state.discountsPrice + +this.state.taxFeePrice + +this.state.deliveryPrice - +this.state.freeShippingDiscountPrice)}</span>
                </div>
              </Col>
            </Row>

            <Row className="consumer-info" style={{ marginTop: 20 }}>
              {/* 收货地址信息 */}
              <Col span={8}>
                <Row>
                  <Col span={12}>
                    <label className="info-title">
                      {deliveryAddressInfo.receiveType === 'PICK_UP' ? (
                        <FormattedMessage id="Subscription.PickupAddress" />
                      ) : (
                        <FormattedMessage id="Subscription.DeliveryAddress" />
                      )}
                    </label>
                  </Col>

                  <Col span={12}>
                    <a style={styles.edit} onClick={() => this.deliveryOpen()} className="iconfont iconEdit"></a>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}><FormattedMessage id="Subscription.Name" />: </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.firstName + ' ' + deliveryAddressInfo.lastName : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}><FormattedMessage id="Subscription.City" />: </p>
                    <p>{deliveryAddressInfo.city}</p>
                  </Col>
                  {deliveryAddressInfo.province ? (
                    <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.State" />: </p>
                      <p>{deliveryAddressInfo.province}</p>
                    </Col>
                  ) : null}

                  <Col span={24}>
                    <p style={{ width: 140 }}><FormattedMessage id="Subscription.Country" />: </p>
                    <p>{this.getDictValue(countryArr, deliveryAddressInfo.countryId)}</p>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}><FormattedMessage id="Subscription.Address1" />: </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}><FormattedMessage id="Subscription.Address2" />: </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}</p>
                  </Col>


                  {deliveryAddressInfo.receiveType === 'PICK_UP' ? (
                    <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.WorkTime" />: </p>
                      <p>{deliveryAddressInfo ? deliveryAddressInfo.workTime : ''}</p>
                    </Col>
                  ) : null}

                  <Col span={24}>
                    {
                      deliveryAddressInfo.receiveType === 'PICK_UP'
                        ? null
                        : deliveryAddressInfo.validFlag
                          ? null
                          : deliveryAddressInfo.alert && <PostalCodeMsg text={deliveryAddressInfo.alert} />
                    }
                  </Col>
                </Row>
              </Col>
              {/* 如果是俄罗斯 如果是HOME_DELIVERY（并且timeslot可选） 显示 timeSlot 信息,如果是PICK_UP 显示pickup 状态
              如果是美国不显示内容 其他国家显示billingAddress */}

              {/* timeSlot和pickup point status */}
              <Col span={8} className="timeSlot">
                {storeId === 123457907 ? <Row>
                  {
                    deliveryAddressInfo.receiveType === 'HOME_DELIVERY' ?
                      <>
                        {
                          deliveryDateList && deliveryDateList.length > 0 ? <>
                            <Col span={12}>
                              <label className="info-title">
                                <FormattedMessage id="Setting.timeSlot" />
                              </label>
                            </Col>

                            <Col span={24}>

                              <Select value={deliveryDate}
                                onChange={this.deliveryDateChange}
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                                placeholder={RCi18n({ id: 'Order.deliveryDate' })}>
                                {
                                  deliveryDateList && deliveryDateList.map((item, index) => (
                                    <Option value={item.date} key={index}>{item.date}</Option>
                                  ))
                                }
                              </Select>

                            </Col>

                            <Col span={24}>
                              <Select value={timeSlot}
                                getPopupContainer={(trigger: any) => trigger.parentNode}
                                onChange={this.timeSlotChange}
                                placeholder={RCi18n({ id: 'Setting.timeSlot' })}>
                                {
                                  timeSlotList && timeSlotList.map((item, index) => (
                                    <Option value={item.startTime + '-' + item.endTime} key={index}>{item.startTime + '-' + item.endTime}</Option>
                                  ))
                                }
                              </Select>

                            </Col>
                          </> : null
                        }

                      </> : deliveryAddressInfo.receiveType === 'PICK_UP' ?
                        <>
                          <Col span={12}><p /></Col>
                          <Col span={24}>
                            {
                              deliveryAddressInfo.pickupPointState ? <p>
                                <FormattedMessage id="Subscription.TabPane.Active" />
                                <span className="successPoint" />
                              </p> : <p>
                                <FormattedMessage id="Subscription.TabPane.Inactive" />
                                <span className="failedPoint" />
                              </p>
                            }
                          </Col>
                        </> : null
                  }

                </Row> : storeId === 123457910 ? null : (
                  <Row>
                    <Col span={12}>
                      <label className="info-title"><FormattedMessage id="Subscription.BillingAddress" /></label>
                    </Col>
                    <Col span={12}>
                      <Tooltip placement="top" title={<FormattedMessage id="Subscription.Active.Change" />}>
                        <a style={styles.edit} onClick={() => this.billingOpen()} className="iconfont iconEdit"></a>
                      </Tooltip>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.Name" />: </p>
                      <p>{billingAddressInfo ? billingAddressInfo.firstName + ' ' + billingAddressInfo.lastName : ''}</p>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.City" />: </p>
                      <p>{billingAddressInfo.city}</p>
                    </Col>
                    {billingAddressInfo.province ? (
                      <Col span={24}>
                        <p style={{ width: 140 }}><FormattedMessage id="Subscription.State" />: </p>
                        <p>{billingAddressInfo.province}</p>
                      </Col>
                    ) : null}

                    <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.Country" />: </p>
                      <p>{this.getDictValue(countryArr, billingAddressInfo.countryId)}</p>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.Address1" />: </p>
                      <p>{billingAddressInfo ? billingAddressInfo.address1 : ''}</p>
                    </Col>
                    <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.Address2" />: </p>
                      <p>{billingAddressInfo ? billingAddressInfo.address2 : ''}</p>
                    </Col>
                  </Row>
                )}
              </Col>

              {/* 显示支付信息 */}
              <Col span={8}>
                <Row>
                  <Col span={12}>
                    <label className="info-title"><FormattedMessage id="Subscription.PaymentMethod" /></label>
                  </Col>
                  <AuthWrapper functionName="f_change_payment_method">
                    <>
                      <Col span={12}>
                        <a style={styles.edit} onClick={() => this.setState({ paymentMethodVisible: true })} className="iconfont iconEdit"></a>
                      </Col>
                      <PaymentMethod
                        cancel={() => this.setState({ paymentMethodVisible: false })}
                        cardId={paymentInfo && paymentInfo.id}
                        customerId={subscriptionInfo.customerId}
                        customerAccount={subscriptionInfo.consumerAccount}
                        changePaymentMethod={(paymentId, payPspItemEnum, selectCard) => {
                          this.setState({
                            paymentId, payPspItemEnum, paymentInfo: selectCard
                          })
                        }}
                        paymentMethodVisible={this.state.paymentMethodVisible} />
                    </>
                  </AuthWrapper>
                  {paymentInfo ?
                    <>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.PaymentMethod" />:{' '}
                        </p>
                        <p>{paymentInfo && paymentInfo.paymentVendor ? paymentInfo.paymentVendor : ''}</p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.CardNumber" />:{' '}
                        </p>
                        <p>{paymentInfo && paymentInfo.lastFourDigits ? '**** **** **** ' + paymentInfo.lastFourDigits : ''}</p>
                      </Col>
                    </>
                    :
                    paymentMethod.indexOf('COD') !== -1 ? <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.PaymentMethod" />: </p>
                      <p><FormattedMessage id="Subscription.CashOnDelivery" /></p>
                    </Col> : null

                  }

                  {this.state.payPspItemEnum ?
                    <div className="errorMessage">
                      <FormattedMessage id="Subscription.savePaymentMethod" />
                    </div> : null}
                </Row>
              </Col>
            </Row>

            {/* 修改收货地址弹窗 */}
            <Modal
              width={650}
              title={RCi18n({ id: "Subscription.ChooseDeliveryAddress" })}
              visible={this.state.visibleShipping}
              confirmLoading={this.state.addressLoading}
              onOk={() => this.deliveryOK()}
              onCancel={() => {
                this.setState({
                  deliveryAddressId: this.state.originalParams.deliveryAddressId,
                  visibleShipping: false
                });
              }}
            >
              <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: 10 }}>

                {/* 选择配送类型 */}
                <Col style={{ marginBottom: 5 }}>
                  <span style={{ marginRight: 10 }}>
                    <FormattedMessage id="Subscription.DeliveryMethod" />
                  </span>
                  <Radio.Group
                    value={deliveryType}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (deliveryList?.length === 1 || pickupAddress?.length) {
                        let daId = '';
                        if (value === 'homeDelivery') {
                          if (deliveryList?.length === 1) {
                            daId = deliveryList[0].deliveryAddressId;
                          }
                        } else if (value === 'pickupDelivery') {
                          if (pickupAddress?.length) {
                            daId = pickupAddress[0].deliveryAddressId;
                          }
                        }
                        this.setState({
                          deliveryAddressId: daId
                        })
                      }
                      this.setState({
                        deliveryType: value
                      })
                    }}
                  >
                    <Radio value='homeDelivery'><FormattedMessage id="Subscription.HomeDelivery" /></Radio>
                    {pickupIsOpen && (
                      <Radio value='pickupDelivery'><FormattedMessage id="Subscription.PickupDelivery" /></Radio>
                    )}
                  </Radio.Group>
                </Col>

                {/* billingAddress是否和deliveryAddress一样 */}
                <Col>
                  {storeId === 123457907 || storeId === 123457910 ? null : <Checkbox
                    checked={this.state.sameFlag}
                    onChange={(e) => {
                      let value = e.target.checked;
                      this.setState({
                        sameFlag: value
                      });
                    }}
                  >
                    <FormattedMessage id="Subscription.BillingAddressIs" />
                  </Checkbox>}
                </Col>

                {/* 新增地址按钮 */}
                {deliveryType === 'pickupDelivery' && pickupAddress?.length ? null : (
                  <Col>
                    {deliveryType === 'pickupDelivery' ? (
                      <Button size="small" type="primary" onClick={() => {
                        this.setState({
                          visibleShipping: false,
                          addOrEditPickup: true
                        });
                      }}>
                        <FormattedMessage id="Subscription.AddNew" />
                      </Button>
                    ) : (
                      <Button size="small" type="primary" onClick={() => this.onOpenAddressForm(NEW_ADDRESS_TEMPLATE, 'delivery')}>
                        <FormattedMessage id="Subscription.AddNew" />
                      </Button>
                    )}
                  </Col>
                )}

              </Row>

              {/*如果是黑名单的地址，则不能选择*/}
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
                {/* pickup 地址列表 pickup地址不需要校验postCode */}
                {
                  deliveryType === 'pickupDelivery' && pickupIsOpen
                    ? (
                      pickupAddress.map((item: any, index: any) => (
                        <Card
                          style={{ width: 602, marginBottom: 10 }}
                          bodyStyle={{ padding: 10 }}
                          key={item.deliveryAddressId}>
                          <Radio value={item.deliveryAddressId}>
                            <div style={{ display: 'inline-grid' }}>
                              <p>{item.firstName + '  ' + item.lastName}</p>
                              <p>{item.city}</p>
                              {item.province ? <p>{item.province}</p> : null}
                              <p>{this.getDictValue(countryArr, item.countryId)}</p>
                              <p>{item.address1}</p>
                              <p>{item.address2}</p>
                              <p>{item.workTime}</p>
                            </div>
                          </Radio>
                          <div>
                            <Button type="link" size="small" onClick={() => {
                              this.setState({
                                visibleShipping: false,
                                addOrEditPickup: true,
                                defaultCity: item.city
                              });
                            }}>
                              <FormattedMessage id="Subscription.Edit" />
                            </Button>
                          </div>
                        </Card>
                      )))
                    : (<>
                      {/* homeDelivery地址列表 */}
                      {this.state.isUnfoldedDelivery
                        ? deliveryList.map((item: any) => (
                          <Card
                            style={{ width: 602, marginBottom: 10 }}
                            bodyStyle={{ padding: 10 }}
                            key={item.deliveryAddressId}>
                            <Radio
                              disabled={!item.validFlag}
                              value={item.deliveryAddressId}
                            >
                              <div style={{ display: 'inline-grid' }}>
                                <p>{item.firstName + '  ' + item.lastName}</p>
                                <p>{item.city}</p>
                                {item.province ? <p>{item.province}</p> : null}

                                <p>{this.getDictValue(countryArr, item.countryId)}</p>
                                <p>{item.address1}</p>
                                <p>{item.address2}</p>
                                {
                                  !item.validFlag
                                    ? item.alert && <PostalCodeMsg text={item.alert} />
                                    : null
                                }
                              </div>
                            </Radio>
                            <div>
                              <Button type="link" size="small" onClick={() => this.onOpenAddressForm({ ...NEW_ADDRESS_TEMPLATE, ...item }, 'delivery')}>
                                <FormattedMessage id="Subscription.Edit" />
                              </Button>
                            </div>
                          </Card>
                        ))
                        : deliveryList.map((item: any, index: any) => index < 2 ? (
                          <Card
                            style={{ width: 602, marginBottom: 10 }}
                            bodyStyle={{ padding: 10 }}
                            key={item.deliveryAddressId}>
                            <Radio disabled={!item.validFlag} value={item.deliveryAddressId}>
                              <div style={{ display: 'inline-grid' }}>
                                <p>{item.firstName + '  ' + item.lastName}</p>
                                <p>{item.city}</p>
                                {item.province ? <p>{item.province}</p> : null}
                                <p>{this.getDictValue(countryArr, item.countryId)}</p>
                                <p>{item.address1}</p>
                                <p>{item.address2}</p>
                                {
                                  !item.validFlag
                                    ? item.alert && <PostalCodeMsg text={item.alert} />
                                    : null
                                }
                              </div>
                            </Radio>
                            <div>
                              <Button type="link" size="small" onClick={() => this.onOpenAddressForm({ ...NEW_ADDRESS_TEMPLATE, ...item }, 'delivery')}>
                                <FormattedMessage id="Subscription.Edit" />
                              </Button>
                            </div>
                          </Card>
                        ) : null
                        )}
                    </>)
                }
              </Radio.Group>

              {/* 显示更多地址按钮 */}
              {deliveryType === 'homeDelivery' ? (
                (deliveryList.length > 2) ? (
                  <Button
                    type="link"
                    onClick={() => {
                      this.setState(
                        (curState: any) => ({
                          isUnfoldedDelivery: !curState.isUnfoldedDelivery
                        })
                      );
                    }}
                  >
                    {isUnfoldedDelivery ? (
                      <FormattedMessage id="Subscription.foldedAll" />
                    ) : (
                      <FormattedMessage id="Subscription.UnfoldedAll" />
                    )}
                  </Button>
                ) : null
              ) : null}

            </Modal>

            {/* pickup弹框 */}
            {pickupIsOpen && addOrEditPickup ? (
              <Modal
                width={650}
                title={pickupAddress?.length ? RCi18n({ id: "Subscription.ChangePickup" }) : RCi18n({ id: "Subscription.AddPickup" })}
                visible={addOrEditPickup}
                confirmLoading={pickupLoading}
                okButtonProps={{ disabled: confirmPickupDisabled }}
                onOk={() => this.pickupConfirm()}
                okText={RCi18n({ id: "Subscription.SelectPickpoint" })}
                onCancel={() => {
                  this.setState({
                    deliveryAddressId: this.state.originalParams.deliveryAddressId,
                    addOrEditPickup: false,
                    visibleShipping: true
                  });
                }}
              >
                <Row type="flex" align="middle" justify="space-between" style={{ marginBottom: 10 }}>
                  <Col style={{ width: '100%' }}>
                    <PickupDelivery
                      key={defaultCity}
                      initData={pickupFormData}
                      from="subscription"
                      pickupAddress={pickupAddress}
                      subscribeGoods={this.state.subscribeGoods}
                      defaultCity={defaultCity}
                      updateConfirmPickupDisabled={this.updateConfirmPickupDisabled}
                      updatePickupEditNumber={this.updatePickupEditNumber}
                      updateData={this.updatePickupData}
                      pickupEditNumber={pickupEditNumber}
                    />
                  </Col>
                </Row>

              </Modal>

            ) : null}

            {/* billingAddress弹框 */}
            <Modal
              title={<FormattedMessage id="Subscription.Active.ChooseBillingAddress" />}
              width={650}
              visible={this.state.visibleBilling}
              onOk={() => this.billingOK()}
              onCancel={() => {
                this.setState({
                  billingAddressId: this.state.originalParams.billingAddressId,
                  visibleBilling: false
                });
              }}
            >
              <div style={{ marginBottom: 10, textAlign: 'right' }}>
                <Button size="small" type="primary" onClick={() => this.onOpenAddressForm(NEW_ADDRESS_TEMPLATE, 'billing')}>
                  <FormattedMessage id="Subscription.AddNew" />
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
                    <Card style={{ width: 602, marginBottom: 10 }} bodyStyle={{ padding: 10 }} key={item.deliveryAddressId}>
                      <Radio value={item.deliveryAddressId}>
                        <div style={{ display: 'inline-grid' }}>
                          <p>{item.firstName + '  ' + item.lastName}</p>
                          <p>{this.getDictValue(countryArr, item.countryId) + ',' + this.getCityName(item)}</p>
                          <p>{item.address1}</p>
                          <p>{item.address2}</p>
                        </div>
                      </Radio>
                      <div>
                        <Button type="link" size="small" onClick={() => this.onOpenAddressForm({ ...NEW_ADDRESS_TEMPLATE, ...item }, 'billing')}>
                          <FormattedMessage id="Subscription.Edit" />
                        </Button>
                      </div>
                    </Card>
                  ))
                  : billingList.map((item, index) =>
                    index < 2 ? (
                      <Card style={{ width: 602, marginBottom: 10 }} bodyStyle={{ padding: 10 }} key={item.deliveryAddressId}>
                        <Radio value={item.deliveryAddressId}>
                          <div style={{ display: 'inline-grid' }}>
                            <p>{item.firstName + '  ' + item.lastName}</p>
                            <p>{this.getDictValue(countryArr, item.countryId) + ',' + this.getCityName(item)}</p>
                            <p>{item.address1}</p>
                            <p>{item.address2}</p>
                          </div>
                        </Radio>
                        <div>
                          <Button type="link" size="small" onClick={() => this.onOpenAddressForm({ ...NEW_ADDRESS_TEMPLATE, ...item }, 'billing')}>
                            <FormattedMessage id="Subscription.Edit" />
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
                  <FormattedMessage id="Subscription.UnfoldedAll" />
                </Button>
              )}
            </Modal>

          </div>
          <div className="container-search" style={{ marginBottom: 20 }}>
            <Headline title={<FormattedMessage id="Subscription.AutoshipOrder" />} />
            <Tabs defaultActiveKey="1" onChange={this.tabChange}>
              <TabPane tab={<FormattedMessage id="Subscription.NoStart" />} key="noStart">
                <Table rowKey={(record, index) => index.toString()} columns={columns_no_start} dataSource={noStartOrder} pagination={false}></Table>
              </TabPane>
              <TabPane tab={<FormattedMessage id="Subscription.Completed" />} key="completed">
                <Table
                  rowKey={(record, index) => index.toString()}
                  rowClassName={(record) => {
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
          <AuthWrapper functionName="f_subscription_feedback">
            <FeedBack subscriptionId={this.state.subscriptionId} />
          </AuthWrapper>
          <div className="bar-button">
            <Button type="primary" onClick={this.updateSubscription} loading={this.state.saveLoading}>
              {<FormattedMessage id="Subscription.save" />}
            </Button>
            <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
              {<FormattedMessage id="Subscription.back" />}
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
  },
};
