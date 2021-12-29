import React from 'react';
import {
  Breadcrumb,
  Card,
  Row,
  Col,
  Button,
  Select,
  message,
  Table,
  InputNumber,
  Modal,
  Radio,
  Checkbox,
  Spin,
  Tooltip,
  Popconfirm,
  Popover,
  Calendar
} from 'antd';
import DeliveryItem from '../customer-details/component/delivery-item';
import { Headline, Const, cache, AuthWrapper, RCi18n, history } from 'qmkit';
import { PostalCodeMsg } from 'biz';
import { FormattedMessage } from 'react-intl';
import './index.less';
import * as webapi from './webapi';
import { GetDelivery } from '../delivery-date/webapi';
import moment from 'moment';
import PickupDelivery from '../customer-details/component/pickup-delivery';
import PaymentMethod from './component/payment-method';
import { addAddress, updateAddress } from '../customer-details/webapi';
import CreditCard from './component/credit-card';

const { Option } = Select;
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
 * Manage All Subscription
 */
export default class ManageAllSubsription extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      pickupIsOpen: false, // pickup开关
      loading: false,
      frequencyList: [],
      individualFrequencyList: [],
      frequencyClubList: [],
      petsId: '',
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
      isUnfoldedDelivery: false,
      isUnfoldedBilling: false,
      saveLoading: false,
      visibleDate: false,
      currencySymbol: '',
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
      timeSlotList: [],
      deliverDateStatus: 0,
      subscriptionList: [],
      checkedSubscriptionIdList: [],
      tempolineApiError: '',
      petOwnerInfo: {},
      showCreditCard: false
    };
  }

  componentDidMount() {
    this.getManageAllSubscription();
    this.getDeliveryDateStatus();
    this.setState({
      pickupIsOpen: JSON.parse(sessionStorage.getItem('portal-pickup-isopen')) || false,
      currencySymbol: sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) || ''
    });
  }

  // 获取 deliveryState 状态
  getDeliveryDateStatus = () => {
    GetDelivery().then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        // deliveryDate 状态
        this.setState({
          deliverDateStatus: res?.context?.systemConfigVO?.status || 0
        });
      }
    });
  };

  //一个订阅含多个商品，进行订阅拆分
  handleSubscriptionGoods = (subscriptionList) => {
    let tempSubscriptionList = [];
    subscriptionList.map((item) => {
      item.goodsResponseVOList.map((e, index) => {
        tempSubscriptionList.push(
          Object.assign(item, { goodsResponse: e, showCheckBox: index === 0 })
        );
      });
    });
    return tempSubscriptionList;
  };

  getManageAllSubscription = () => {
    this.setState({
      loading: true
    });
    webapi
      .getTaskSubscriptionList({
        customerAccount: sessionStorage.getItem('taskCustomerAccount')
      })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getDict();
          let subscriptionList = this.handleSubscriptionGoods(
            res.context.subscriptionResponseVOList
          );
          this.setState(
            {
              subscriptionList: subscriptionList,
              petOwnerInfo: subscriptionList.length > 0 ? subscriptionList[0] : {},
              customerId: res.context.customerVO.customerId
            },
            () => {
              this.getAddressList(this.state.customerId, 'DELIVERY');
              this.getAddressList(this.state.customerId, 'BILLING');
            }
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        this.setState({
          loading: false
        });
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
            let frequencyClubList = [
              ...this.state.frequencyClubList,
              ...res.context.sysDictionaryVOS
            ];
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
            let frequencyClubList = [
              ...this.state.frequencyClubList,
              ...res.context.sysDictionaryVOS
            ];
            this.setState({
              frequencyClubList: frequencyClubList
            });
          }
        } else {
        }
      })
      .catch(() => {});
  };

  onGoodsChange = ({ field, goodsId, value }) => {
    let data = this.state.subscriptionList;
    data = data.map((item) => {
      if (item.goodsResponse.skuId === goodsId) {
        if (field === 'subscribeNum') {
          item.goodsResponse.subscribeNum = value;
        } else {
          item.goodsResponse.periodTypeId = value;
        }
      }
      return item;
    });
    this.setState({
      subscriptionList: data
    });
  };

  updateSubscription = () => {
    const {
      deliveryAddressId,
      deliveryAddressInfo,
      deliveryDateList,
      timeSlotList,
      deliveryDate,
      timeSlot,
      checkedSubscriptionIdList,
      subscriptionList
    } = this.state;
    this.setState({
      saveLoading: true,
      tempolineApiError: ''
    });
    //俄罗斯 HOME_DELIVERY 如果deliveryDateList 有值,
    if (
      +storeId === 123457907 &&
      deliveryAddressInfo.receiveType === 'HOME_DELIVERY' &&
      deliveryDateList.length > 0
    ) {
      //deliveryDate 没有选择 报错
      if (!deliveryDate) {
        message.error(RCi18n({ id: 'Subscription.MissDeliveryDateTip' }));
        return;
      }
      // timeSlotList存在，但是timeSlot没有值 报错
      if (timeSlotList && !timeSlot) {
        message.error(RCi18n({ id: 'Subscription.MissTimeSlotTip' }));
        return;
      }
    }
    let goodsItems = [];
    subscriptionList.map((ele) => {
      checkedSubscriptionIdList.map((item) => {
        if (ele.subscribeId === item) {
          goodsItems.push({
            subscribeGoodsId: ele.goodsResponse.subscribeGoodsId,
            subscribeNum: ele.goodsResponse.subscribeNum,
            subscribeId: ele.goodsResponse.subscribeId,
            skuId: ele.goodsResponse.skuId,
            periodTypeId: ele.goodsResponse.periodTypeId
          });
        }
      });
    });
    let apiParams = {
      subscriptionIdList: this.state.checkedSubscriptionIdList,
      goodsItems: goodsItems,
      customerId: this.state.customerId
    };
    if (this.state.paymentId) {
      apiParams = Object.assign(apiParams, { paymentId: this.state.paymentId });
    }
    if (deliveryAddressId) {
      apiParams = Object.assign(apiParams, { deliveryAddressId: deliveryAddressId });
    }
    if (deliveryDate) {
      apiParams = Object.assign(apiParams, { deliveryDate: deliveryDate });
    }
    if (timeSlot) {
      apiParams = Object.assign(apiParams, { timeSlot: timeSlot });
    }
    console.log('apiParams', apiParams);

    webapi
      .updateManageAllSubscription(apiParams)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            saveLoading: false,
            payPspItemEnum: ''
          });
          message.success(RCi18n({ id: 'Subscription.OperateSuccessfully' }));
          setTimeout(() => {
            this.getManageAllSubscription();
          }, 1000);
        } else {
          this.setState({
            saveLoading: false
          });
        }
      })
      .catch((error) => {
        this.setState({
          saveLoading: false,
          tempolineApiError: error.message
        });
      });
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
    const { deliveryAddressInfo, pickupIsOpen, pickupEditNumber } = this.state;
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

          this.setState(
            {
              allAddressList: allList,
              deliveryList: addressList,
              pickupAddress: pickup,
              customerAccount: customerAccount,
              customerId: customerId,
              visibleShipping: showModal
            },
            () => {
              console.log('666 >>> pickupEditNumber: ', pickupEditNumber);
              let dltype = '';
              if (pickupEditNumber > 0) {
                dltype = sessionStorage.getItem('portal-delivery-method') ?? 'homeDelivery';

                let daId = '';
                if (dltype === 'homeDelivery' && addressList?.length === 1) {
                  daId = addressList[0].deliveryAddressId;
                } else if (dltype === 'pickupDelivery' && pickup?.length) {
                  daId = pickup[0].deliveryAddressId;
                }

                this.setState({
                  deliveryAddressId: daId
                });
              } else {
                // 根据 receiveType 设置默认选中
                let rctype = deliveryAddressInfo?.receiveType || '';
                dltype = rctype === 'PICK_UP' && pickupIsOpen ? 'pickupDelivery' : 'homeDelivery';
              }
              this.setState({
                deliveryType: dltype
              });
            }
          );
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
          message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
        } else {
          message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
        }
        this.setState({
          addOrEditPickup: false,
          pickupLoading: false,
          visibleShipping: true
        });
      })
      .catch((err) => {
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
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
      isDefaltAddress: pickupFormData.isDefaltAddress ? 1 : 0
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
        message.success(RCi18n({ id: 'PetOwner.OperateSuccessfully' }));
      } else {
        message.error(RCi18n({ id: 'PetOwner.Unsuccessful' }));
      }
      this.setState(
        {
          addOrEditPickup: false,
          pickupLoading: false,
          visibleShipping: true
        },
        () => {
          this.getAddressList(customerId, 'DELIVERY', true);
        }
      );
    }
  };

  deliveryOK = async () => {
    const {
      deliveryList,
      allAddressList,
      deliveryAddressId,
      checkedSubscriptionIdList,
      subscriptionList
    } = this.state;
    let deliveryAddressInfo = allAddressList.find((item: any) => {
      return item.deliveryAddressId === deliveryAddressId;
    });

    // 切换pickup地址时，获取pick point 状态
    if (deliveryAddressInfo.receiveType === 'PICK_UP') {
      await webapi.getPickupPointStatus(deliveryAddressId).then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          deliveryAddressInfo['pickupPointState'] = res.context;
        }
      });
      let goodsItems = [];
      subscriptionList.map((ele) => {
        checkedSubscriptionIdList.map((item) => {
          if (ele.subscribeId === item) {
            goodsItems.push({
              subscribeGoodsId: ele.goodsResponse.subscribeGoodsId,
              subscribeNum: ele.goodsResponse.subscribeNum,
              subscribeId: ele.goodsResponse.subscribeId,
              skuId: ele.goodsResponse.skuId,
              periodTypeId: ele.goodsResponse.periodTypeId
            });
          }
        });
      });
      let apiParams = {
        deliveryAddressId: deliveryAddressId,
        subscriptionIdList: checkedSubscriptionIdList,
        goodsItems: goodsItems,
        customerId: this.state.customerId
      };

      await webapi
        .updateManageAllSubscription(apiParams)
        .then(() => {})
        .catch((error) => {
          this.setState({
            tempolineApiError: error.message
          });
          return;
        });
    }

    // 俄罗斯地址验证是否完整 (暂时不判断pickup地址)
    if (
      deliveryAddressInfo.receiveType !== 'PICK_UP' &&
      (window as any).countryEnum[
        JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId ?? 0
      ] === 'ru'
    ) {
      if (
        !deliveryAddressInfo.street ||
        !deliveryAddressInfo.postCode ||
        !deliveryAddressInfo.house ||
        !deliveryAddressInfo.city
      ) {
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
        this.getTimeSlot({
          cityNo: deliveryAddressInfo.provinceIdStr,
          subscribeId: checkedSubscriptionIdList[0]
        });
        this.setState({
          deliveryDate: undefined,
          timeSlot: undefined
        });
      }
    }

    let addressList = this.selectedOnTop(deliveryList, deliveryAddressId);

    //计算运费, 改为从后端getPromotionPirce接口获取
    this.setState({ addressLoading: true });

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

  skipNextSubscription = () => {
    this.setState({
      loading: true
    });
    webapi
      .skipManageAllSubscription({ subscriptionIdList: this.state.checkedSubscriptionIdList })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({ checkedSubscriptionIdList: [] });
          this.getManageAllSubscription();
          message.success(RCi18n({ id: 'Subscription.OperationSuccessful' }));
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

  cancelManageAllSubscription = () => {
    this.setState({
      loading: true
    });
    webapi
      .cancelManageAllSubscription({ subscriptionIdList: this.state.checkedSubscriptionIdList })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({ checkedSubscriptionIdList: [] });
          this.getManageAllSubscription();
          message.success(RCi18n({ id: 'Subscription.OperationSuccessful' }));
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

  pauseManageAllSubscription = () => {
    this.setState({
      loading: true
    });
    webapi
      .pauseManageAllSubscription({ subscriptionIdList: this.state.checkedSubscriptionIdList })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({ checkedSubscriptionIdList: [] });
          this.getManageAllSubscription();
          message.success(RCi18n({ id: 'Subscription.OperationSuccessful' }));
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
    const { subscriptionList, checkedSubscriptionIdList } = this.state;
    let goodsItems = [];
    subscriptionList.map((ele) => {
      checkedSubscriptionIdList.map((item) => {
        if (ele.subscribeId === item) {
          goodsItems.push({
            subscribeGoodsId: ele.goodsResponse.subscribeGoodsId,
            subscribeId: ele.goodsResponse.subscribeId,
            skuId: ele.goodsResponse.skuId
          });
        }
      });
    });

    let params = {
      subscriptionIdList: checkedSubscriptionIdList,
      nextDeliveryTime: date ? moment(date).format('YYYY-MM-DD') : '',
      changeField: 'Delivery Time',
      goodsItems: goodsItems
    };
    this.setState({
      visibleDate: false,
      loading: true
    });
    webapi
      .updateManageAllSubscriptionNextDeliveryTime(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getManageAllSubscription();
          message.success(RCi18n({ id: 'Subscription.OperationSuccessful' }));
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

  handleVisibleDateChange = () => {
    const { visibleDate } = this.state;
    this.setState({
      visibleDate: !visibleDate
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
          message.error(res.message || RCi18n({ id: 'Subscription.OperationFailure' }));
        }
      })
      .catch((err) => {
        message.error(err.toString() || RCi18n({ id: 'Subscription.OperationFailure' }));
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

  getTimeSlot = (params: any) => {
    webapi.getTimeSlot(params).then((data) => {
      const { deliveryDate, timeSlot } = this.state;
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let deliveryDateList = res.context.timeSlots;
        this.setState({
          deliveryDateList: deliveryDateList,
          timeSlotList: (deliveryDateList[0] && deliveryDateList[0].dateTimeInfos) || [],
          deliveryDate: deliveryDate
            ? deliveryDate
            : deliveryDateList[0] && deliveryDateList[0].date,
          timeSlot: timeSlot
            ? timeSlot
            : deliveryDateList[0] &&
              deliveryDateList[0].dateTimeInfos[0].startTime +
                '-' +
                deliveryDateList[0].dateTimeInfos[0].endTime
        });
      }
    });
  };

  deliveryDateChange = (value: any) => {
    const { deliveryDateList, deliveryDate, timeSlot } = this.state;
    let timeSlots = deliveryDateList.find((item) => item.date === value).dateTimeInfos || [];
    this.setState({
      deliveryDate: value,
      timeSlotList: timeSlots,
      timeSlot: deliveryDate === value ? timeSlot : undefined
    });
  };
  //timeslot
  timeSlotChange = (value: any) => {
    this.setState({
      timeSlot: value
    });
  };

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

  // 选择配送类型
  handleSelectDeliveryMethod = (e: any) => {
    const { deliveryList, pickupAddress,subscriptionList,checkedSubscriptionIdList } = this.state;
    let value = e.target.value;
    let daId = '';
    if (value === 'homeDelivery' && deliveryList?.length === 1) {
      daId = deliveryList[0].deliveryAddressId;
    } else if (value === 'pickupDelivery' && pickupAddress?.length) {
      daId = pickupAddress[0].deliveryAddressId;
    }
    if(value === 'pickupDelivery'){
      let subscribeGoods = [];
      subscriptionList.map((ele) => {
        checkedSubscriptionIdList.map((item) => {
          if (ele.subscribeId === item) {
            subscribeGoods.push({
              goodsInfoId: ele.goodsResponse.goodsInfoId,
              quantity: ele.goodsResponse.subscribeNum
            });
          }
        });
      });
      this.setState({subscribeGoods:subscribeGoods})
    }
    this.setState({
      deliveryAddressId: daId
    });
    sessionStorage.setItem('portal-delivery-method', value);
    this.setState({
      deliveryType: value
    });
  };

  render() {
    const {
      pickupIsOpen,
      petOwnerInfo,
      individualFrequencyList,
      frequencyList,
      frequencyClubList,
      paymentInfo,
      deliveryAddressInfo,
      billingAddressInfo,
      countryArr,
      billingList,
      currencySymbol,
      visibleDate,
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
      timeSlot,
      deliverDateStatus,
      subscriptionList,
      checkedSubscriptionIdList
    } = this.state;

    const columns = [
      {
        title: <FormattedMessage id="task.AssociateSubscription" />,
        width: '7%',
        key: 'index',
        render: (text, record) =>
          record.showCheckBox ? (
            <Checkbox
              checked={checkedSubscriptionIdList.includes(record.subscribeId)}
              onChange={(e) => {
                const tempCheckedSubscription = checkedSubscriptionIdList;
                let index = tempCheckedSubscription.indexOf(record.subscribeId);
                if (index !== -1) {
                  tempCheckedSubscription.splice(index, 1);
                } else {
                  tempCheckedSubscription.push(record.subscribeId);
                }
                this.setState({ checkedSubscriptionIdList: tempCheckedSubscription });
              }}
            />
          ) : null
      },
      {
        title: <FormattedMessage id="Subscription.SubscriptionNumber" />,
        dataIndex: 'subscribeId',
        key: 'subscribeId',
        width: '7%'
      },
      {
        title: <FormattedMessage id="product.productName" />,
        key: 'Product',
        width: '7%',
        render: (text: any, record: any) => record.goodsResponse.goodsName
      },
      {
        title: <FormattedMessage id="Task.ShipmentDate" />,
        width: '7%',
        key: 'ShipmentDate',
        render: (text: any, record: any) => record.goodsResponse.nextDeliveryTime
      },
      {
        title: <FormattedMessage id="Task.DeliveryAddress" />,
        width: '9%',
        key: 'address1',
        render: (text: any, record: any) => record?.consignee?.address1
      },
      {
        title: <FormattedMessage id="Order.paymentMethod" />,
        key: 'paymentMethod',
        width: '6%',
        render: (text: any, record: any) => record.paymentMethod
      },
      {
        title: <FormattedMessage id="weight" />,
        width: '5%',
        render: (text: any, record: any) => record.goodsResponse.specText
      },
      {
        title: <FormattedMessage id="Product.ExternalSKU" />,
        dataIndex: 'externalSubscribeId',
        width: '7%'
      },
      {
        // title: <FormattedMessage id="task.statusOfSubscription" />,
        title: <FormattedMessage id="Subscription.SubscriptionStatus" />,
        dataIndex: 'subscribeStatus',
        render: (text: any, record: any) => <span>{text === '0' ? 'Active' : 'Pause'}</span>
      },
      {
        // title: <FormattedMessage id="Subscription.Qty" />,
        title: <FormattedMessage id="Subscription.Quantity" />,
        key: 'subscribeNum',
        width: '5%',
        render: (text, record) => (
          <div className="subscription_edit_quantity">
            {record.subscriptionType == 'Individualization' ? (
              1
            ) : (
              <InputNumber
                min={1}
                max={100}
                onChange={(value) => {
                  value = +value.toString().replace(/\D/g, '');
                  this.onGoodsChange({
                    field: 'subscribeNum',
                    goodsId: record.goodsResponse.skuId,
                    value
                  });
                }}
                value={record.goodsResponse.subscribeNum}
                disabled={record.subscriptionType === 'Peawee'}
              />
            )}
          </div>
        )
      },
      {
        title: <FormattedMessage id="Subscription.Frequency" />,
        dataIndex: 'frequency',
        key: 'frequency',
        width: '6%',
        render: (text: any, record: any) => (
          <div className="subscription_edit_frequency">
            <Select
              style={{ width: '100%' }}
              value={record.goodsResponse.periodTypeId}
              onChange={(value: any) => {
                value = value === '' ? null : value;
                this.onGoodsChange({
                  field: 'periodTypeId',
                  goodsId: record.goodsResponse.skuId,
                  value
                });
              }}
              disabled={record.subscriptionType === 'Peawee'}
            >
              {/* individualFrequencyList */}
              {record.subscriptionType == 'Individualization'
                ? individualFrequencyList.map((item: any) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))
                : ((record.goodsInfoVO?.promotions ?? record.goodsVO?.promotions) === 'club'
                    ? frequencyClubList
                    : frequencyList
                  ).map((item: any) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
            </Select>
          </div>
        )
      },
      {
        title: <FormattedMessage id="Order.Total amount" />,
        dataIndex: 'Total',
        key: 'Total',
        width: '6%',
        render: (text: any, record: any) => (
          <div>
            <span>
              {currencySymbol +
                ' ' +
                +record.goodsResponse.subscribeNum * +record.goodsResponse.subscribePrice}
            </span>
          </div>
        )
      },
      // {
      //   title: <FormattedMessage id="subscription.deliveryDate" />,
      //   width: '6%',
      //   render: (text: any, record: any) => record?.deliveryDate
      // },
      {
        title: <FormattedMessage id="Order.timeSlot" />,
        width: '8%',
        render: (text: any, record: any) => (
          <span>
            {record?.deliveryDate}
            <br />
            {record?.timeSlot}
          </span>
        )
      },
      {
        title: <FormattedMessage id="Subscription.DeliveryMethod" />,
        render: (text: any, record: any) =>
          record.deliveryType === 1
            ? 'Home Delivery'
            : record.deliveryType === 2
            ? 'Pickup Delivery'
            : ''
      },
      {
        title: <FormattedMessage id="task.pickPointStatus" />,
        render: (text: any, record: any) =>
          record.consignee.pickupPointState ? 'Active' : 'Inactive'
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
                <div style={{ marginBottom: '10px' }}>
                  <FormattedMessage id="Subscription.CustomHeader" />{' '}
                </div>
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
          defaultValue={moment()}
          onSelect={this.updateNextDeliveryTime}
        />
      </div>
    );

    return (
      <div>
        {/* 面包屑 */}
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">
              <FormattedMessage id="Menu.Home" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href={'/tasks'}>
              <FormattedMessage id="task.TaskBoard" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href={`/edit-task/${sessionStorage.getItem('taskId')}`}>
              <FormattedMessage id="task.Taskedition" />
            </a>
          </Breadcrumb.Item>
          {sessionStorage.getItem('subscriptionNo') ? (
            <Breadcrumb.Item>
              <a
                onClick={() => {
                  sessionStorage.setItem('fromTaskToSubDetail', 'true');
                  history.push(`/subscription-detail/${sessionStorage.getItem('subscriptionNo')}`);
                }}
              >
                <FormattedMessage id="Subscription.detail" />
              </a>
            </Breadcrumb.Item>
          ) : null}
          {this.state.showAddressForm ? (
            <>
              <Breadcrumb.Item>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    this.backToSubscriptionEdit(false);
                  }}
                >
                  <FormattedMessage id="task.manageAllSubBtn" />
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {this.state.addressType === 'delivery' ? (
                  <FormattedMessage id="Subscription.Delivery information" />
                ) : (
                  <FormattedMessage id="Subscription.Billing information" />
                )}
              </Breadcrumb.Item>
            </>
          ) : (
            <Breadcrumb.Item>{<FormattedMessage id="task.manageAllSubBtn" />}</Breadcrumb.Item>
          )}
        </Breadcrumb>

        {this.state.showAddressForm ? (
          <DeliveryItem
            customerId={this.state.customerId}
            delivery={this.state.addressItem}
            addressType={this.state.addressType}
            backToDetail={this.backToSubscriptionEdit}
            fromPage="subscription"
            pickupEditNumber={pickupEditNumber}
            updatePickupEditNumber={this.updatePickupEditNumber}
          />
        ) : this.state.showCreditCard ? (
          <CreditCard
            customerId={this.state.customerId}
            customerAccount={sessionStorage.getItem('taskCustomerAccount')}
            backToManageAllSub={() => {
              this.setState({ showCreditCard: false });
            }}
          />
        ) : (
          <Spin spinning={this.state.loading}>
            {' '}
            <div className="container-search task-manage-all-subscription">
              <Headline title={<FormattedMessage id="task.manageAllSubBtn" />} />

              {/* subscription 基本信息 */}
              <Row className="subscription-basic-info">
                <Col span={11} className="basic-info">
                  <p>
                    <FormattedMessage id="Subscription.PetOwnerName" /> :{' '}
                    <span>{petOwnerInfo.customerName}</span>
                  </p>
                  <p>
                    <FormattedMessage id="Subscription.ConsumerAccount" /> :{' '}
                    <span>{petOwnerInfo.customerAccount}</span>
                  </p>
                  <p>
                    <FormattedMessage id="Subscription.ConsumerType" /> :{' '}
                    <span>{petOwnerInfo.customerType}</span>
                  </p>
                  <p>
                    <FormattedMessage id="Subscription.PhoneNumber" /> :{' '}
                    <span>{petOwnerInfo.customerPhone}</span>
                  </p>
                </Col>
              </Row>

              {/* subscription 和 total */}
              <Row style={{ marginTop: 20 }} gutter={16}>
                <Col span={24}>
                  <Table
                    rowKey={(record, index) => index.toString()}
                    columns={columns}
                    dataSource={subscriptionList}
                    pagination={false}
                  />
                </Col>
              </Row>

              <Row className="consumer-info" style={{ marginTop: 20 }}>
                {/* 收货地址信息 */}
                <Col span={7}>
                  <Row>
                    <Col span={12}>
                      <label className="info-title info_title_edit_delivery_address">
                        {deliveryAddressInfo.receiveType === 'PICK_UP' ? (
                          <FormattedMessage id="Subscription.PickupAddress" />
                        ) : (
                          <FormattedMessage id="Subscription.DeliveryAddress" />
                        )}
                      </label>
                    </Col>

                    <Col span={12}>
                      {checkedSubscriptionIdList.length > 0 ? (
                        <a
                          onClick={() => this.deliveryOpen()}
                          className="iconfont iconEdit pr-10"
                        />
                      ) : null}
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Name" />:{' '}
                      </p>
                      <p>
                        {deliveryAddressInfo?.firstName} {deliveryAddressInfo?.lastName}
                      </p>
                    </Col>
                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.City" />:{' '}
                      </p>
                      <p>{deliveryAddressInfo.city}</p>
                    </Col>
                    {deliveryAddressInfo.province ? (
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.State" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo.province}</p>
                      </Col>
                    ) : null}

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Country" />:{' '}
                      </p>
                      <p>
                        {deliveryAddressInfo.countryId
                          ? this.getDictValue(countryArr, deliveryAddressInfo.countryId)
                          : deliveryAddressInfo.country}
                      </p>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Address1" />:{' '}
                      </p>
                      <p>{deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}</p>
                    </Col>
                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Address2" />:{' '}
                      </p>
                      <p className="delivery_edit_address2">
                        {deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}
                      </p>
                    </Col>

                    {deliveryAddressInfo?.county ? (
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.County" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo ? deliveryAddressInfo.county : ''}</p>
                      </Col>
                    ) : null}

                    {deliveryAddressInfo.receiveType === 'PICK_UP' ? (
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.WorkTime" />:{' '}
                        </p>
                        <p>{deliveryAddressInfo ? deliveryAddressInfo.workTime : ''}</p>
                      </Col>
                    ) : null}

                    <Col span={24}>
                      {deliveryAddressInfo.receiveType === 'PICK_UP'
                        ? null
                        : deliveryAddressInfo.validFlag
                        ? null
                        : deliveryAddressInfo.alert && (
                            <PostalCodeMsg text={deliveryAddressInfo.alert} />
                          )}
                    </Col>
                  </Row>
                </Col>

                {/* 如果是俄罗斯 且 deliverDateStatus为1 如果是HOME_DELIVERY（并且timeslot可选） 显示 timeSlot 信息,如果是PICK_UP 显示pickup 状态
              如果是美国不显示内容 其他国家显示billingAddress */}
                {/* timeSlot和pickup point status */}
                <Col span={7} className="timeSlot subscription_edit_timeSlot">
                  {storeId === 123457907 ? (
                    <>
                      {deliverDateStatus === 1 ? (
                        <Row>
                          {deliveryAddressInfo.receiveType === 'HOME_DELIVERY' ? (
                            <>
                              {deliveryDateList && deliveryDateList.length > 0 ? (
                                <>
                                  <Col span={12}>
                                    <label className="info-title">
                                      <FormattedMessage id="Setting.timeSlot" />
                                    </label>
                                  </Col>

                                  <Col span={24}>
                                    <Select
                                      value={deliveryDate}
                                      onChange={this.deliveryDateChange}
                                      getPopupContainer={(trigger: any) => trigger.parentNode}
                                      placeholder={RCi18n({ id: 'Order.deliveryDate' })}
                                    >
                                      {deliveryDateList &&
                                        deliveryDateList.map((item, index) => (
                                          <Option value={item.date} key={index}>
                                            {item.date}
                                          </Option>
                                        ))}
                                    </Select>
                                  </Col>

                                  <Col span={24}>
                                    <Select
                                      value={timeSlot}
                                      getPopupContainer={(trigger: any) => trigger.parentNode}
                                      onChange={this.timeSlotChange}
                                      placeholder={RCi18n({ id: 'Setting.timeSlot' })}
                                    >
                                      {timeSlotList &&
                                        timeSlotList.map((item, index) => (
                                          <Option
                                            value={item.startTime + '-' + item.endTime}
                                            key={index}
                                          >
                                            {item.startTime + '-' + item.endTime}
                                          </Option>
                                        ))}
                                    </Select>
                                  </Col>
                                </>
                              ) : null}
                            </>
                          ) : deliveryAddressInfo.receiveType === 'PICK_UP' ? (
                            <>
                              <Col span={12}>
                                <p />
                              </Col>
                              <Col span={24}>
                                {deliveryAddressInfo.pickupPointState ? (
                                  <p>
                                    <FormattedMessage id="Subscription.TabPane.Active" />
                                    <span className="successPoint" />
                                  </p>
                                ) : (
                                  <p>
                                    <FormattedMessage id="Subscription.TabPane.Inactive" />
                                    <span className="failedPoint" />
                                  </p>
                                )}
                              </Col>
                            </>
                          ) : null}
                        </Row>
                      ) : null}{' '}
                    </>
                  ) : storeId === 123457910 ? null : (
                    <Row>
                      <Col span={12}>
                        <label className="info-title info_title_edit_billing_address">
                          <FormattedMessage id="Subscription.BillingAddress" />
                        </label>
                      </Col>
                      <Col span={12}>
                        <Tooltip
                          placement="top"
                          title={<FormattedMessage id="Subscription.Active.Change" />}
                        >
                          <a
                            onClick={() => this.billingOpen()}
                            className="iconfont iconEdit pr-10"
                          />
                        </Tooltip>
                      </Col>

                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.Name" />:{' '}
                        </p>
                        <p>
                          {billingAddressInfo
                            ? billingAddressInfo.firstName + ' ' + billingAddressInfo.lastName
                            : ''}
                        </p>
                      </Col>

                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.City" />:{' '}
                        </p>
                        <p>{billingAddressInfo.city}</p>
                      </Col>
                      {billingAddressInfo.province ? (
                        <Col span={24}>
                          <p style={{ width: 140 }}>
                            <FormattedMessage id="Subscription.State" />:{' '}
                          </p>
                          <p>{billingAddressInfo.province}</p>
                        </Col>
                      ) : null}

                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.Country" />:{' '}
                        </p>
                        <p>
                          {billingAddressInfo.countryId
                            ? this.getDictValue(countryArr, billingAddressInfo.countryId)
                            : billingAddressInfo.country}
                        </p>
                      </Col>

                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.Address1" />:{' '}
                        </p>
                        <p>{billingAddressInfo ? billingAddressInfo.address1 : ''}</p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.Address2" />:{' '}
                        </p>
                        <p className="billing_edit_address2">
                          {billingAddressInfo ? billingAddressInfo.address2 : ''}
                        </p>
                      </Col>

                      {billingAddressInfo?.county ? (
                        <Col span={24}>
                          <p style={{ width: 140 }}>
                            <FormattedMessage id="Subscription.County" />:{' '}
                          </p>
                          <p>{billingAddressInfo ? billingAddressInfo.county : ''}</p>
                        </Col>
                      ) : null}
                    </Row>
                  )}
                </Col>

                {/* 显示支付信息 */}
                <Col span={7}>
                  <Row>
                    <Col span={12}>
                      <label className="info-title subscription_edit_payment">
                        <FormattedMessage id="Subscription.PaymentMethod" />
                      </label>
                    </Col>
                    <AuthWrapper functionName="f_change_payment_method">
                      {Const.SITE_NAME !== 'MYVETRECO' && (
                        <>
                          <Col span={12}>
                            {checkedSubscriptionIdList.length > 0 ? (
                              <a
                                onClick={() => this.setState({ paymentMethodVisible: true })}
                                className="iconfont iconEdit pr-10"
                              />
                            ) : null}
                          </Col>
                          <PaymentMethod
                            cancel={() => this.setState({ paymentMethodVisible: false })}
                            cardId={paymentInfo && paymentInfo.id}
                            customerId={this.state.customerId}
                            customerAccount={sessionStorage.getItem('taskCustomerAccount')}
                            changePaymentMethod={(paymentId, payPspItemEnum, selectCard) => {
                              this.setState({
                                paymentId,
                                payPspItemEnum,
                                paymentInfo: selectCard
                              });
                            }}
                            paymentMethodVisible={this.state.paymentMethodVisible}
                            addNewCard={() => {
                              this.setState({ showCreditCard: true });
                            }}
                          />
                        </>
                      )}
                    </AuthWrapper>
                    {paymentInfo ? (
                      <>
                        <Col span={24}>
                          <p style={{ width: 140 }}>
                            <FormattedMessage id="Subscription.PaymentMethod" />:{' '}
                          </p>
                          <p>
                            {paymentInfo && paymentInfo.paymentVendor
                              ? paymentInfo.paymentVendor
                              : ''}
                          </p>
                        </Col>
                        <Col span={24}>
                          <p style={{ width: 140 }}>
                            <FormattedMessage id="Subscription.CardNumber" />:{' '}
                          </p>
                          <p>
                            {paymentInfo && paymentInfo.lastFourDigits
                              ? '**** **** **** ' + paymentInfo.lastFourDigits
                              : ''}
                          </p>
                        </Col>
                      </>
                    ) : paymentMethod.indexOf('COD') !== -1 ? (
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.PaymentMethod" />:{' '}
                        </p>
                        <p>
                          <FormattedMessage id="Subscription.CashOnDelivery" />
                        </p>
                      </Col>
                    ) : null}

                    {this.state.payPspItemEnum ? (
                      <div className="errorMessage">
                        <FormattedMessage id="Subscription.savePaymentMethod" />
                      </div>
                    ) : null}
                  </Row>
                </Col>
                {/*操作按钮*/}
                <Col span={3}>
                  {checkedSubscriptionIdList.length > 0 ? (
                    <div>
                      <Popover
                        content={content}
                        trigger="click"
                        visible={visibleDate}
                        onVisibleChange={() => this.handleVisibleDateChange()}
                      >
                        <Tooltip
                          placement="top"
                          title={<FormattedMessage id="Subscription.SelectDate" />}
                        >
                          <Button type="link" style={{ padding: '0 5px' }}>
                            <i className="iconfont icondata" />
                          </Button>
                        </Tooltip>
                      </Popover>
                      <Popconfirm
                        placement="topLeft"
                        title={<FormattedMessage id="Subscription.skipThisItem" />}
                        onConfirm={() => {
                          this.skipNextSubscription();
                        }}
                        okText="Confirm"
                        cancelText="Cancel"
                      >
                        <Tooltip
                          placement="top"
                          title={<FormattedMessage id="Subscription.SkipDelivery" />}
                        >
                          <Button type="link" style={{ padding: '0 5px' }}>
                            <i className="iconfont iconskip" />
                          </Button>
                        </Tooltip>
                      </Popconfirm>
                      <Tooltip
                        placement="top"
                        title={<FormattedMessage id="Subscription.CancelAll" />}
                      >
                        <Button
                          type="link"
                          style={{ padding: '0 5px', fontWeight: 600 }}
                          onClick={() => {
                            this.cancelManageAllSubscription();
                          }}
                        >
                          <i className="iconfont iconbtn-cancelall" />
                        </Button>
                      </Tooltip>
                      <Tooltip placement="top" title={<FormattedMessage id="Subscription.Pause" />}>
                        <Button
                          type="link"
                          style={{ padding: '0 5px' }}
                          onClick={() => {
                            this.pauseManageAllSubscription();
                          }}
                        >
                          <i className="iconfont iconbtn-pause" />
                        </Button>
                      </Tooltip>
                    </div>
                  ) : null}
                </Col>
                <Col span={24}>
                  <div className="manage-all-sub-button">
                    <Button
                      type="primary"
                      onClick={this.updateSubscription}
                      loading={this.state.saveLoading}
                      disabled={checkedSubscriptionIdList.length === 0}
                    >
                      {<FormattedMessage id="Subscription.save" />}
                    </Button>
                    <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
                      {<FormattedMessage id="Subscription.back" />}
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* 修改收货地址弹窗 */}
              <Modal
                width={650}
                title={RCi18n({ id: 'Subscription.ChooseDeliveryAddress' })}
                visible={this.state.visibleShipping}
                confirmLoading={this.state.addressLoading}
                onOk={() => this.deliveryOK()}
                okButtonProps={{ disabled: this.state.tempolineApiError !== '' }}
                onCancel={() => {
                  this.setState({
                    deliveryAddressId: '',
                    visibleShipping: false
                  });
                }}
              >
                <Row
                  type="flex"
                  align="middle"
                  justify="space-between"
                  style={{ marginBottom: 10 }}
                >
                  {/* 选择配送类型 */}
                  <Col style={{ marginBottom: 5 }}>
                    <span style={{ marginRight: 10 }}>
                      <FormattedMessage id="Subscription.DeliveryMethod" />
                    </span>
                    <Radio.Group
                      value={deliveryType}
                      onChange={(e) => {
                        this.handleSelectDeliveryMethod(e);
                      }}
                    >
                      <Radio value="homeDelivery">
                        <FormattedMessage id="Subscription.HomeDelivery" />
                      </Radio>
                      {pickupIsOpen && (
                        <Radio value="pickupDelivery">
                          <FormattedMessage id="Subscription.PickupDelivery" />
                        </Radio>
                      )}
                    </Radio.Group>
                  </Col>

                  {/* billingAddress是否和deliveryAddress一样 */}
                  <Col>
                    {storeId === 123457907 || storeId === 123457910 ? null : (
                      <Checkbox
                        checked={this.state.sameFlag}
                        onChange={(e) => {
                          let value = e.target.checked;
                          this.setState({
                            sameFlag: value
                          });
                        }}
                      >
                        <FormattedMessage id="Subscription.BillingAddressIs" />
                      </Checkbox>
                    )}
                  </Col>

                  {/* 新增地址按钮 */}
                  {deliveryType === 'pickupDelivery' && pickupAddress?.length ? null : (
                    <Col>
                      {deliveryType === 'pickupDelivery' ? (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            this.setState({
                              visibleShipping: false,
                              addOrEditPickup: true
                            });
                          }}
                        >
                          <FormattedMessage id="Subscription.AddNew" />
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => this.onOpenAddressForm(NEW_ADDRESS_TEMPLATE, 'delivery')}
                        >
                          <FormattedMessage id="Subscription.AddNew" />
                        </Button>
                      )}
                    </Col>
                  )}
                </Row>

                {this.state.tempolineApiError ? <div>{this.state.tempolineApiError}</div> : null}

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
                  {deliveryType === 'pickupDelivery' && pickupIsOpen ? (
                    (pickupAddress || []).map((item: any, index: any) => (
                      <Card
                        style={{ width: 602, marginBottom: 10 }}
                        bodyStyle={{ padding: 10 }}
                        key={item.deliveryAddressId}
                      >
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
                          <Button
                            type="link"
                            size="small"
                            onClick={() => {
                              this.setState({
                                visibleShipping: false,
                                addOrEditPickup: true,
                                defaultCity: item.city
                              });
                            }}
                          >
                            <FormattedMessage id="Subscription.Edit" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <>
                      {/* homeDelivery地址列表 */}
                      {this.state.isUnfoldedDelivery
                        ? deliveryList.map((item: any) => (
                            <Card
                              style={{ width: 602, marginBottom: 10 }}
                              bodyStyle={{ padding: 10 }}
                              key={item.deliveryAddressId}
                            >
                              <Radio disabled={!item.validFlag} value={item.deliveryAddressId}>
                                <div style={{ display: 'inline-grid' }}>
                                  <p>{item.firstName + '  ' + item.lastName}</p>
                                  <p>{item.city}</p>
                                  {item.province ? <p>{item.province}</p> : null}

                                  <p>{this.getDictValue(countryArr, item.countryId)}</p>
                                  <p>{item.address1}</p>
                                  <p>{item.address2}</p>
                                  {!item.validFlag
                                    ? item.alert && <PostalCodeMsg text={item.alert} />
                                    : null}
                                </div>
                              </Radio>
                              <div>
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() =>
                                    this.onOpenAddressForm(
                                      { ...NEW_ADDRESS_TEMPLATE, ...item },
                                      'delivery'
                                    )
                                  }
                                >
                                  <FormattedMessage id="Subscription.Edit" />
                                </Button>
                              </div>
                            </Card>
                          ))
                        : deliveryList.map((item: any, index: any) =>
                            index < 2 ? (
                              <Card
                                style={{ width: 602, marginBottom: 10 }}
                                bodyStyle={{ padding: 10 }}
                                key={item.deliveryAddressId}
                              >
                                <Radio disabled={!item.validFlag} value={item.deliveryAddressId}>
                                  <div style={{ display: 'inline-grid' }}>
                                    <p>{item.firstName + '  ' + item.lastName}</p>
                                    <p>{item.city}</p>
                                    {item.province ? <p>{item.province}</p> : null}
                                    <p>{this.getDictValue(countryArr, item.countryId)}</p>
                                    <p>{item.address1}</p>
                                    <p>{item.address2}</p>
                                    {!item.validFlag
                                      ? item.alert && <PostalCodeMsg text={item.alert} />
                                      : null}
                                  </div>
                                </Radio>
                                <div>
                                  <Button
                                    type="link"
                                    size="small"
                                    onClick={() =>
                                      this.onOpenAddressForm(
                                        { ...NEW_ADDRESS_TEMPLATE, ...item },
                                        'delivery'
                                      )
                                    }
                                  >
                                    <FormattedMessage id="Subscription.Edit" />
                                  </Button>
                                </div>
                              </Card>
                            ) : null
                          )}
                    </>
                  )}
                </Radio.Group>

                {/* 显示更多地址按钮 */}
                {deliveryType === 'homeDelivery' ? (
                  deliveryList.length > 2 ? (
                    <Button
                      type="link"
                      onClick={() => {
                        this.setState((curState: any) => ({
                          isUnfoldedDelivery: !curState.isUnfoldedDelivery
                        }));
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
                  title={
                    pickupAddress?.length
                      ? RCi18n({ id: 'Subscription.ChangePickup' })
                      : RCi18n({ id: 'Subscription.AddPickup' })
                  }
                  visible={addOrEditPickup}
                  confirmLoading={pickupLoading}
                  okButtonProps={{ disabled: confirmPickupDisabled }}
                  onOk={() => this.pickupConfirm()}
                  okText={RCi18n({ id: 'Subscription.SelectPickpoint' })}
                  onCancel={() => {
                    this.setState({
                      deliveryAddressId: '',
                      addOrEditPickup: false,
                      visibleShipping: true
                    });
                  }}
                >
                  <Row
                    type="flex"
                    align="middle"
                    justify="space-between"
                    style={{ marginBottom: 10 }}
                  >
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
                    billingAddressId: '',
                    visibleBilling: false
                  });
                }}
              >
                <div style={{ marginBottom: 10, textAlign: 'right' }}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => this.onOpenAddressForm(NEW_ADDRESS_TEMPLATE, 'billing')}
                  >
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
                        <Card
                          style={{ width: 602, marginBottom: 10 }}
                          bodyStyle={{ padding: 10 }}
                          key={item.deliveryAddressId}
                        >
                          <Radio value={item.deliveryAddressId}>
                            <div style={{ display: 'inline-grid' }}>
                              <p>{item.firstName + '  ' + item.lastName}</p>
                              <p>
                                {this.getDictValue(countryArr, item.countryId) +
                                  ',' +
                                  this.getCityName(item)}
                              </p>
                              <p>{item.address1}</p>
                              <p>{item.address2}</p>
                            </div>
                          </Radio>
                          <div>
                            <Button
                              type="link"
                              size="small"
                              onClick={() =>
                                this.onOpenAddressForm(
                                  { ...NEW_ADDRESS_TEMPLATE, ...item },
                                  'billing'
                                )
                              }
                            >
                              <FormattedMessage id="Subscription.Edit" />
                            </Button>
                          </div>
                        </Card>
                      ))
                    : billingList.map((item, index) =>
                        index < 2 ? (
                          <Card
                            style={{ width: 602, marginBottom: 10 }}
                            bodyStyle={{ padding: 10 }}
                            key={item.deliveryAddressId}
                          >
                            <Radio value={item.deliveryAddressId}>
                              <div style={{ display: 'inline-grid' }}>
                                <p>{item.firstName + '  ' + item.lastName}</p>
                                <p>
                                  {this.getDictValue(countryArr, item.countryId) +
                                    ',' +
                                    this.getCityName(item)}
                                </p>
                                <p>{item.address1}</p>
                                <p>{item.address2}</p>
                              </div>
                            </Radio>
                            <div>
                              <Button
                                type="link"
                                size="small"
                                onClick={() =>
                                  this.onOpenAddressForm(
                                    { ...NEW_ADDRESS_TEMPLATE, ...item },
                                    'billing'
                                  )
                                }
                              >
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
          </Spin>
        )}
      </div>
    );
  }
}
