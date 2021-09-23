import React from 'react';
import { FormattedMessage } from 'react-intl';
import IMask from 'imask';
import SearchSelection from './search-selection';
import { Spin } from 'antd';
import { cache, RCi18n } from 'qmkit';
import * as webapi from './webapi';

import './pickup-delivery.less';

class PickupDelivery extends React.Component {
  static defaultProps = {
    initData: null,
    defaultCity: '',
    pickupAddress: [],
    pickupEditNumber: 0,
    updatePickupLoading: () => { },
    updatePickupEditNumber: () => { },
    updateData: () => { }
  };
  constructor(props) {
    super(props);
    this.state = {
      pickLoading: false,
      showPickup: false,
      showPickupDetail: false,
      showPickupDetailDialog: false,
      showPickupForm: false,
      pickUpBtnLoading: false,
      searchNoResult: false,
      pickupCity: '',
      currencySymbol: '',
      courierInfo: [], // 快递公司信息
      selectedItem: null, // 记录选择的内容
      pickupForm: {
        isDefaltAddress: 0,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        consigneeNumber: '',
        comment: '',
        address1: '',
        city: '',
        paymentMethods: '', // 支付方式
        pickupPrice: '',
        pickupCode: '', // 快递公司code
        pickupName: '', // 快递公司
        workTime: '', // 快递公司上班时间
        receiveType: '', // HOME_DELIVERY , PICK_UP
        formRule: [
          //   {
          //     regExp: /\S/,
          //     errMsg: CURRENT_LANGFILE['payment.errorInfo2'],
          //     key: 'firstName',
          //     require: true
          //   },
          //   {
          //     regExp: /\S/,
          //     errMsg: CURRENT_LANGFILE['payment.errorInfo2'],
          //     key: 'lastName',
          //     require: true
          //   },
          //   {
          //     regExp: /^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
          //     errMsg: CURRENT_LANGFILE['payment.errorInfo2'],
          //     key: 'phoneNumber',
          //     require: true
          //   }
        ]
      },
      pickupErrMsgs: {
        firstName: '',
        lastName: '',
        phoneNumber: ''
      }
    };
  }
  async componentDidMount() {
    let initData = this.props.initData;
    this.setState(
      {
        pickupForm: Object.assign(this.state.pickupForm, initData)
      }
    );

    // 监听iframe的传值
    window.addEventListener('message', (e) => {
      // 地图上选择快递公司后返回
      if (e?.data?.type == 'get_delivery_point') {
        const { pickupForm } = this.state;
        // console.log('666 监听地图点的传值: ', e);
        let obj = e.data.content;
        pickupForm['pickupPrice'] = obj?.price || [];
        pickupForm['pickupDescription'] = obj?.description || [];
        pickupForm['pickupCode'] = obj?.code || [];
        pickupForm['pickupName'] = obj?.courier || [];

        // ★★ 自提点返回支付方式：
        // 1. cod: cash & card，shop展示cod和卡支付
        // 2. cod: cash 或 card，shop展示cod和卡支付
        // 3. 无返回，shop展示卡支付
        let pickupPayMethods = null;
        let payway = obj?.paymentMethods || [];
        if (payway.length) {
          pickupPayMethods = payway[0].split('_')[0].toLocaleLowerCase();
        }
        pickupForm['paymentMethods'] = pickupPayMethods;

        pickupForm['city'] = obj?.address?.city || [];
        pickupForm['address1'] = obj?.address?.fullAddress || [];
        pickupForm['workTime'] = obj?.workTime || [];
        pickupForm['pickup'] = obj || [];
        this.setState(
          {
            courierInfo: obj || null,
            pickupForm
          },
          () => {
            let sitem =
              sessionStorage.getItem('rc-portal-homeDeliveryAndPickup') || null;
            if (sitem) {
              sitem = JSON.parse(sitem);
              sitem['pickup'] = obj;
              sessionStorage.setItem(
                'rc-portal-homeDeliveryAndPickup',
                JSON.stringify(sitem)
              );
            }
            this.setState(
              {
                selectedItem: sitem,
                showPickupDetail: true,
                showPickupForm: true,
                showPickup: false
              },
              () => {
                this.setPickupTelNumberReg();
              }
            );
          }
        );
      }

      // iframe加载完毕后返回
      if (e?.data?.loading == 'succ') {
        this.sendMsgToIframe();
      }
    });

    let sitem = sessionStorage.getItem('rc-portal-homeDeliveryAndPickup') || null;
    sitem = JSON.parse(sitem);

    let defaultCity = this.props.defaultCity;
    console.log('666 >>> defaultCity : ', defaultCity);

    // 有默认city且无缓存 或者 有缓存
    let pickupEditNumber = this.props.pickupEditNumber;
    if ((defaultCity && !sitem) || (defaultCity && pickupEditNumber == 0) || pickupEditNumber > 0) {
      // 有默认城市但没有缓存
      defaultCity
        ? (defaultCity = defaultCity)
        : (defaultCity = sitem?.cityData?.city);
      let res = await webapi.pickupQueryCity(defaultCity);
      let robj = res?.res?.context?.pickUpQueryCityDTOs || [];
      if (robj) {
        this.handlePickupCitySelectChange(robj[0]);
      } else {
        this.setState({
          searchNoResult: true
        });
      }
    } else if (sitem?.homeAndPickup?.length && pickupEditNumber > 0) {
      // 初始化数据，本地存储有数据（当前会话未结束）
      let stype = '';
      let newobj = [];
      let isSelectedItem = false; // 是否有选中项
      sitem?.homeAndPickup.forEach((v, i) => {
        let tp = v.type;
        if (v.selected) {
          stype = tp;
          isSelectedItem = true;
        }
        if (tp == 'pickup' || tp == 'homeDelivery') {
          newobj.push(v);
        }
      });

      sitem.homeAndPickup = newobj;
      this.setState(
        {
          selectedItem: sitem,
          pickupCity: sitem?.cityData?.city || defaultCity
        },
        () => {
          if (isSelectedItem) {
            this.setItemStatus(stype);
          }
        }
      );
    }
    this.props.updatePickupLoading(false);
  }
  getCurrencySymbol = () => {
    let currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : '';
    this.setState({
      currencySymbol
    });
  };
  // 设置手机号输入限制
  setPickupTelNumberReg = () => {
    let telnum = document.getElementById('phoneNumberShippingPickup');
    let telOptions = {
      mask: [{ mask: '+{7} (000) 000-00-00' }]
    };
    IMask(telnum, telOptions);
  };
  // 判断输入city是否有返回值
  handlePickupQueryCity = async (city, data) => {
    const { selectedItem } = this.state;
    let flag = false;
    data?.length ? (flag = false) : (flag = true);
    if (flag) {
      this.setState({
        pickupCity: city,
        selectedItem: Object.assign(selectedItem, {
          cityData: [],
          homeAndPickup: []
        })
      });
    }
    this.setState({
      searchNoResult: flag
    });
  };
  // 搜索下拉选择。1、游客和新用户展示homeDelivery和pickup；2、有地址的用户直接展示地图。
  handlePickupCitySelectChange = async (data) => {
    const { pickupEditNumber, defaultCity } = this.props;
    const { selectedItem, pickupForm } = this.state;
    let res = null;
    this.setState({
      pickLoading: true,
      searchNoResult: false
    });
    try {
      // 向子域发送数据
      this.sendMsgToIframe('close');

      // 更新pickup编辑次数
      let pknum = Number(pickupEditNumber) + 1;
      this.props.updatePickupEditNumber(pknum);

      data['dimensions'] = null;
      data['weight'] = null;
      // 根据不同的城市信息查询
      res = await webapi.pickupQueryCityFee(data);
      if (res?.res?.context?.tariffs.length) {

        // 'COURIER'=> home delivery、'PVZ'=> pickup
        let obj = res.res.context.tariffs;

        // 有地址的时候，单独展示pickup，如果查询到不支持pickup，给出错误提示
        if (this.props.pickupAddress.length) {
          let pvzobj = obj.filter((e) => e.type == 'PVZ');
          if (!pvzobj.length) {
            this.setState({
              searchNoResult: true
            });
            return;
          }
        }

        // 先清空数组
        let selitem = Object.assign({}, selectedItem);
        selitem.homeAndPickup = [];

        pickupForm['provinceCode'] = data?.regionIsoCode || '';
        pickupForm['provinceIdStr'] = data.regionFias;
        pickupForm['areaIdStr'] = data.areaFias;
        pickupForm['cityIdStr'] = data.cityFias;
        pickupForm['settlementIdStr'] = data.settlementFias;

        this.setState(
          {
            pickupForm,
            selectedItem: Object.assign({}, selitem)
          },
          () => {
            let hdpu = [];
            obj.forEach((v, i) => {
              let type = v.type;
              v.selected = false;
              // 显示pickup
              if (type == 'PVZ') {
                v.selected = true;
                v.type = 'pickup';
                hdpu.push(v);
              }
            });
            let item = {
              cityData: data,
              homeAndPickup: hdpu
            };
            this.setState(
              {
                pickupCity: data.city,
                selectedItem: Object.assign({}, item)
              },
              () => {
                sessionStorage.setItem('rc-portal-homeDeliveryAndPickup', JSON.stringify(item));

                // 只显示pickup
                this.setItemStatus('pickup');
              }
            );
          }
        );
      } else {
        if (pickupEditNumber == 0 && defaultCity) {
          this.setState({
            pickupCity: defaultCity
          });
        }
        // 先清空数组
        let selitem = Object.assign({}, selectedItem);
        selitem.homeAndPickup = [];
        this.setState({
          selectedItem: Object.assign({}, selitem)
        });
        this.setState({
          searchNoResult: true
        });
      }
    } catch (err) {
      console.warn(err);
    } finally {
      this.setState({
        pickLoading: false
      });
      this.props.updatePickupLoading(false);
    }
  };
  // 单选按钮选择
  handleRadioChange = (e) => {
    const { selectedItem } = this.state;
    let val = e.currentTarget?.value;
    let sitem = Object.assign({}, selectedItem);

    sitem?.homeAndPickup.forEach((v, i) => {
      if (v.type == val) {
        v['selected'] = true;
      } else {
        v['selected'] = false;
      }
    });
    this.setState(
      {
        selectedItem: Object.assign({}, sitem)
      },
      () => {
        sessionStorage.setItem('rc-portal-homeDeliveryAndPickup', JSON.stringify(sitem));
        this.setItemStatus(val);
      }
    );
  };
  // 设置状态
  setItemStatus = (val) => {
    const { pickupEditNumber } = this.props;
    const { pickupForm, selectedItem } = this.state;
    this.setState({ pickLoading: true });
    // 处理选择结果
    let pickupItem = null;
    let sitem = Object.assign({}, selectedItem);
    sitem?.homeAndPickup.forEach((v, i) => {
      if (v.type == val) {
        // 选中 pickup
        v.type == 'pickup' ? (pickupItem = v) : null;
      }
    });
    let flag = false;
    if (val == 'homeDelivery') {
      flag = false;
      this.setState({
        showPickupForm: false,
        showPickupDetailDialog: false,
        showPickupDetail: false
      });
    } else if (val == 'pickup') {
      flag = true;
      this.sendMsgToIframe();
    }

    let pkobj = {
      city: sitem?.cityData?.city || [],
      calculation: pickupItem,
      maxDeliveryTime: pickupItem?.maxDeliveryTime || 0,
      minDeliveryTime: pickupItem?.minDeliveryTime || 0,
      receiveType: flag ? 'PICK_UP' : 'HOME_DELIVERY'
    };

    // 再次编辑地址的时候，从缓存中取city数据
    if (pickupEditNumber > 0) {
      let sobj = sessionStorage.getItem('rc-portal-homeDeliveryAndPickup') || null;
      sobj = JSON.parse(sobj);
      let cityData = sobj?.cityData;
      pkobj['provinceCode'] = cityData?.regionIsoCode || '';
      pkobj['provinceIdStr'] = cityData?.regionFias;
      pkobj['areaIdStr'] = cityData?.areaFias;
      pkobj['cityIdStr'] = cityData?.cityFias;
      pkobj['settlementIdStr'] = cityData?.settlementFias;
    }

    this.setState(
      {
        showPickup: flag,
        pickLoading: false,
        pickupForm: Object.assign(pickupForm, pkobj)
      },
      () => {
        this.props.updateData(this.state.pickupForm);
      }
    );
  };
  // 向iframe发送数据
  sendMsgToIframe = (str) => {
    const { pickupCity } = this.state;
    // iframe加载完成后才能向子域发送数据
    let childFrameObj = document.getElementById('pickupIframe');
    let msg = '';
    switch (str) {
      case 'city':
        msg = pickupCity;
        break;
      case 'close':
        msg = 'clearMap';
        break;
      default:
        msg = pickupCity;
        break;
    }
    childFrameObj.contentWindow.postMessage({ msg: msg }, '*');
  };
  // 编辑pickup
  editPickup = () => {
    const { courierInfo } = this.state;
    if (courierInfo) {
      this.sendMsgToIframe();
    }
    this.setState({
      showPickupForm: false,
      showPickupDetail: false,
      showPickup: true
    });
  };
  // 显示pickup详细
  showPickupDetailDialog = () => {
    this.setState({
      showPickupForm: false,
      showPickupDetailDialog: true,
      showPickupDetail: false
    });
  };
  // 隐藏pickup详细弹框
  hidePickupDetailDialog = () => {
    this.setState({
      showPickupForm: true,
      showPickupDetailDialog: false,
      showPickupDetail: true
    });
  };
  // pickup表单验证
  pickupValidvalidat = async (tname, tvalue) => {
    const { pickupForm, pickupErrMsgs } = this.state;
    let targetRule = pickupForm.formRule.filter((e) => e.key === tname);
    try {
      await validData(targetRule, { [tname]: tvalue });
      this.setState({
        pickupErrMsgs: Object.assign({}, pickupErrMsgs, {
          [tname]: ''
        })
      });
      this.validFormAllPickupData();
    } catch (err) {
      this.setState({
        pickupErrMsgs: Object.assign({}, pickupErrMsgs, {
          [tname]: err.message
        })
      });
    }
  };
  // 验证表单所有数据
  validFormAllPickupData = async () => {
    const { pickupForm } = this.state;
    try {
      await validData(pickupForm.formRule, pickupForm);
      pickupForm.consigneeNumber = pickupForm.phoneNumber;
      this.props.updateData(pickupForm);
    } catch {
    }
  };
  // 文本框输入改变
  inputChange = (e) => {
    const { pickupForm } = this.state;
    const target = e?.target;
    const tname = target?.name;
    let tvalue = target?.value;
    pickupForm[tname] = tvalue;
    this.setState({ pickupForm }, () => {
      this.pickupValidvalidat(tname, tvalue); // 验证数据
    });
  };
  // 文本框失去焦点
  inputBlur = (e) => {
    const { pickupForm } = this.state;
    const target = e?.target;
    const tname = target?.name;
    const tvalue = target?.value;
    pickupForm[tname] = tvalue;
    this.setState({ pickupForm }, () => {
      this.pickupValidvalidat(tname, tvalue); // 验证数据
    });
  };
  // 文本框
  inputJSX = (key) => {
    const { pickupForm, pickupErrMsgs } = this.state;
    let flag = 1;
    key == 'comment' ? (flag = 0) : (flag = 1);
    let item = {
      fieldKey: key,
      filedType: 'text',
      maxLength: 200,
      requiredFlag: flag
    };
    return (
      <>
        <span className="rc-input rc-input--inline rc-full-width rc-input--full-width">
          {key == 'comment' ? (
            <>
              <textarea
                className="rc_input_textarea"
                placeholder={RCi18n({ id: 'Subscription.Deliverycomment' })}
                id={`${item.fieldKey}ShippingPickup`}
                value={pickupForm[item.fieldKey] || ''}
                onChange={(e) => this.inputChange(e)}
                onBlur={this.inputBlur}
                name={item.fieldKey}
                maxLength={item.maxLength}
              ></textarea>
            </>
          ) : (
            <>
              <input
                className={`rc-input__control ${item.fieldKey}Shipping`}
                id={`${item.fieldKey}ShippingPickup`}
                type={item.filedType}
                value={pickupForm[item.fieldKey] || ''}
                onChange={(e) => this.inputChange(e)}
                onBlur={this.inputBlur}
                name={item.fieldKey}
                maxLength={item.maxLength}
              />
            </>
          )}
          <label className="rc-input__label" htmlFor="id-text1" />
        </span>
        {/* 输入电话号码提示 */}
        {item.fieldKey == 'phoneNumber' && (
          <span className="ui-lighter">
            <FormattedMessage id="Subscription.ExamplePhone" />
          </span>
        )}
        {/* 输入提示 */}
        {/* {pickupErrMsgs[item.fieldKey] && item.requiredFlag == 1 ? (
          <div className="text-danger-2">{pickupErrMsgs[item.fieldKey]}</div>
        ) : null} */}
      </>
    );
  };
  // 设为默认
  handleDefaultChange = () => {
    let data = this.state.pickupForm;
    data.isDefaltAddress = !data.isDefaltAddress;
    this.setState({
      pickupForm: data
    });
  };
  // 清除未搜索到城市提示
  closeSearchErrMsg = () => {
    this.setState({
      searchNoResult: false,
      pickupCity: ''
    });
  };


  render() {
    const {
      pickLoading,
      showPickup,
      showPickupDetail,
      showPickupDetailDialog,
      showPickupForm,
      pickupCity,
      courierInfo,
      searchNoResult,
      currencySymbol,
      pickupForm
    } = this.state;

    return (
      <>
        <Spin spinning={pickLoading}>
          {/* homeDelivery begin */}
          <div className="row rc_form_box rc_pickup_box">
            <div className="col-md-7">
              {/* 城市搜索 begin */}
              <div className="form-group rc-full-width rc-input--full-width">
                <div
                  className={`rc-input rc-input--inline rc-full-width rc-input--full-width pickup_search_box ${searchNoResult ? 'pickup_search_box_errmsg' : null
                    }`}
                >
                  <SearchSelection
                    queryList={async ({ inputVal }) => {
                      let res = await webapi.pickupQueryCity(inputVal);
                      let robj = (
                        (res?.res?.context && res?.res?.context?.pickUpQueryCityDTOs) ||
                        []
                      ).map((ele) => Object.assign(ele, { name: ele.city }));
                      return robj;
                    }}
                    selectedItemChange={(data) => this.handlePickupCitySelectChange(data)}
                    key={pickupCity}
                    defaultValue={pickupCity}
                    value={pickupCity || ''}
                    freeText={false}
                    name="pickupCity"
                    placeholder={RCi18n({ id: 'Subscription.FillCityOfDelivery' })}
                    isLoadingList={false}
                    isBottomPaging={true}
                  />
                  {searchNoResult && (
                    <span
                      className="close_search_errmsg"
                      onClick={this.closeSearchErrMsg}
                    ></span>
                  )}
                </div>
                {searchNoResult && (
                  <div className="text-danger-2" style={{ paddingTop: '.5rem' }}>
                    <FormattedMessage id="Subscription.NoPickup" />
                  </div>
                )}
              </div>
              {/* 城市搜索 end */}
            </div>
          </div>
          {/* homeDelivery end */}

          {/* pickup相关 begin */}
          <div className={`pickup_box`}>
            {/* 地图 */}
            <div
              className={`pickup_map_box ${showPickup ? 'flex' : 'hidden'
                }`}
            >
              <iframe
                id="pickupIframe"
                src="/pickup-map"
                className="pickup_iframe"
                style={{ width: '100%', height: '100%' }}
                width="100%"
                height="100%"
                scrolling="no"
                frameBorder="0"
              />
              {/* <div className="pickup_map_box"><div id="kaktusMap"></div></div> */}
            </div>

            {/* 显示地图上选择的点信息 */}
            {showPickupDetail && courierInfo ? (
              <div className="pickup_infos">
                <div className="info_tit">
                  <div className="tit_left">{pickupForm.pickupName}</div>
                  <div className="tit_right">
                    {currencySymbol + ' ' + pickupForm.pickupPrice}
                  </div>
                </div>
                <div className="infos">
                  <div className="panel_address">{pickupForm.address1}</div>
                  <div className="panel_worktime">{pickupForm.workTime}</div>
                </div>
                <div className="info_btn_box">
                  <button
                    className="rc-btn rc-btn--sm rc-btn--two mr-0"
                    onClick={this.showPickupDetailDialog}
                  >
                    <FormattedMessage id="Subscription.MoreDetails" />
                  </button>
                  <button
                    className="rc-btn rc-btn--sm rc-btn--one"
                    onClick={this.editPickup}
                  >
                    <FormattedMessage id="Subscription.Edit" />
                  </button>
                </div>
              </div>
            ) : null}

            {/* pickup详细 */}
            {showPickupDetailDialog && courierInfo ? (
              <div className="pickup_detail_dialog">
                <div className="pk_detail_box">
                  <span
                    className="pk_btn_close"
                    onClick={this.hidePickupDetailDialog}
                  ></span>
                  <div className="pk_tit_box">
                    <div className="pk_detail_title">
                      {pickupForm.pickupName} ({pickupForm.pickupCode})
                    </div>
                    <div className="pk_detail_price">
                      {currencySymbol + ' ' + pickupForm.pickupPrice}
                    </div>
                  </div>
                  <div className="pk_detail_address pk_addandtime">
                    {pickupForm.address1}
                  </div>
                  <div className="pk_detail_worktime pk_addandtime">
                    {pickupForm.workTime}
                  </div>
                  <div className="pk_detail_dop_title">
                    Дополнительная информация
                  </div>
                  <div className="pk_detail_description">
                    {pickupForm.pickupDescription}
                  </div>
                </div>
              </div>
            ) : null}

            {/* 表单 */}
            <div
              className={`row rc_form_box rc_pickup_form ${showPickupForm ? 'flex' : 'hidden'
                }`}
            >
              <div className="col-md-7 mb-2">
                <div className="form-group required">
                  <label
                    className="form-control-label"
                    htmlFor="firstNameShipping"
                  >
                    <FormattedMessage id="Order.FirstName" />
                  </label>
                  {this.inputJSX('firstName')}
                </div>
              </div>
              <div className="col-md-7 mb-2">
                <div className="form-group required">
                  <label
                    className="form-control-label"
                    htmlFor="lastNameShipping"
                  >
                    <FormattedMessage id="Order.LastName" />
                  </label>
                  {this.inputJSX('lastName')}
                </div>
              </div>
              <div className="col-md-7 mb-2">
                <div className="form-group required">
                  <label
                    className="form-control-label"
                    htmlFor="phoneNumberShipping"
                  >
                    <FormattedMessage id="Order.Phonenumber" />
                  </label>
                  {this.inputJSX('phoneNumber')}
                </div>
              </div>
              <div className="col-md-12 mb-2">
                <div className="form-group ">
                  <label className="form-control-label" htmlFor="commentShipping">
                    <FormattedMessage id="PetOwner.Comment" />
                  </label>
                  {this.inputJSX('comment')}
                </div>
              </div>
            </div>
          </div>
          {/* pickup相关 end */}

        </Spin>
      </>
    );
  }
}

export default PickupDelivery;