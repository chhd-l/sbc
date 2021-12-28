import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history, RCi18n, AuthWrapper, cache } from 'qmkit';
import { Switch, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Alert, InputNumber, Tabs, Spin } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage, injectIntl } from 'react-intl';
import './index.less';
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;

class OrderSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Order.Order" />,
      message: <FormattedMessage id="Order.OperationTips" />,
      paymentSequence: <FormattedMessage id="Order.PaymentBeforeDelivery" />,
      paymentCategory: 'Online payment',
      loading: false,
      btnLoading: false,
      paymentOnlineForm: {
        orderExpirationTimeStatus: false,
        orderExpirationTimeValue: 1,
        orderConfirmReceiptStatus: false,
        orderConfirmReceiptValue: 1,
        orderRefundsStatus: false,
        orderRefundsValue: 1,
        orderAutomaticReviewStatus: false,
        orderAutomaticReviewValue: 1,
        orderAutomaticSkipStatus: false,
        orderAutomaticSkipValue: 1,
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 1,
        orderAutomaticTriggerStatus: false,
        orderAutomaticTriggerValue: 1,
        orderAllowZonePriceStatus: false,
        orderAllowZonePriceValue: 1,
        paymentWhen: 'None',
        statusChangeWhen:'delivered',
      },
      paymentCashForm: {
        orderExpirationTimeStatus: false,
        orderExpirationTimeValue: 1,
        orderConfirmReceiptStatus: false,
        orderConfirmReceiptValue: 1,
        orderRefundsStatus: false,
        orderRefundsValue: 1,
        orderAutomaticReviewStatus: false,
        orderAutomaticReviewValue: 1,
        orderAutomaticSkipStatus: false,
        orderAutomaticSkipValue: 1,
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 1,
        orderAutomaticTriggerStatus: false,
        orderAutomaticTriggerValue: 1,
        paymentWhen: 'None',
        statusChangeWhen:'delivered',
      },
      unlimitedForm: {
        orderExpirationTimeStatus: false,
        orderExpirationTimeValue: 1,
        orderConfirmReceiptStatus: false,
        orderConfirmReceiptValue: 1,
        orderRefundsStatus: false,
        orderRefundsValue: 1,
        orderAutomaticReviewStatus: false,
        orderAutomaticReviewValue: 1,
        orderAutomaticSkipStatus: false,
        orderAutomaticSkipValue: 1,
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 1,
        orderAutomaticTriggerStatus: false,
        orderAutomaticTriggerValue: 1,
      },
      sequenceRequestList: [],
      pcashList: [],
      ponlineList: [],
      unLimitedList: [],
      fieldForm: {
        orderField: '',
        subscriptionField: '',
        returnOrderField: ''
      }
    };
  }
  componentDidMount() {
    this.getOrderSettingConfig();
    this.getQueryOrderSequenceFn();
  }

  handleCategoryChange = (e) => {
    this.setState({
      paymentCategory: e.target.value
    });
  };
  //修改规则
  getQueryOrderSequenceFn = async () => {
    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')['storeId'] || ''
    const { res } = await webapi.getQueryOrderSequence(storeId)
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        sequenceRequestList: res.context
      })
    }
  }
  paymentOnlineFormChange = ({ field, value }) => {
    let data = this.state.paymentOnlineForm;
    data[field] = value;
    this.setState({
      paymentOnlineForm: data
    });
  };
  paymentCashFormChange = ({ field, value }) => {
    let data = this.state.paymentCashForm;
    data[field] = value;
    this.setState({
      paymentCashForm: data
    });
  };
  unlimitedOnlineFormChange = ({ field, value }) => {
    if (!value && value !== false) {
      value = 1;
    }
    let data = this.state.unlimitedOnlineForm;
    data[field] = value;
    this.setState({
      unlimitedOnlineForm: data
    });
  };
  unlimitedFormChange = ({ field, value }) => {
    let data = this.state.unlimitedForm;
    data[field] = value;
    this.setState({
      unlimitedForm: data
    });
  };

  getOrderSettingConfig = () => {
    this.setState({
      loading: true
    })
    webapi
      .getOrderSettingConfig()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const { paymentOnlineForm, paymentCashForm, unlimitedForm } = this.state;
          let pcashList = res.context.pcashList;
          let ponlineList = res.context.ponlineList;
          let unLimitedList = res.context.unLimitedList;
          ponlineList.map((item) => {
            if (item.configType === 'order_capture_payment_when') {
              paymentOnlineForm.paymentWhen = item.context;
            }
            //订单失效时间
            if (item.configType === 'order_setting_timeout_cancel') {
              paymentOnlineForm.orderExpirationTimeStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderExpirationTimeValue = context.hour;
            }
            // 自动收货
            if (item.configType === 'order_setting_auto_receive') {
              paymentOnlineForm.orderConfirmReceiptStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderConfirmReceiptValue = context.day;
            }
            // 允许退单
            if (item.configType === 'order_setting_apply_refund') {
              paymentOnlineForm.orderRefundsStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderRefundsValue = context.day;
            }
            // 待审核退单自动审核
            if (item.configType === 'order_setting_refund_auto_audit') {
              paymentOnlineForm.orderAutomaticReviewStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderAutomaticReviewValue = context.day;
            }
            // 自动跳过物流信息采集
            if (item.configType === 'order_setting_refund_auto_fill_logic_info') {
              paymentOnlineForm.orderAutomaticSkipStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderAutomaticSkipValue = context.day;
            }
            // 退单自动确认收货
            if (item.configType === 'order_setting_refund_auto_receive') {
              paymentOnlineForm.orderAutomaticConfirmationStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderAutomaticConfirmationValue = context.day;
            }
            //自动触发全额退款
            if (item.configType === 'order_setting_refund_auto_refund') {
              paymentOnlineForm.orderAutomaticTriggerStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderAutomaticTriggerValue = context.day;
            }
            //允许0元订单
            if (item.configType === 'order_setting_zero_order') {
              paymentOnlineForm.orderAllowZonePriceStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderAllowZonePriceValue = context.hour;
            }
          });

          pcashList.map((item) => {
            if (item.configType === 'order_capture_payment_when') {
              paymentCashForm.paymentWhen = item.context;
            }
            //订单失效时间
            if (item.configType === 'order_setting_timeout_cancel') {
              paymentCashForm.orderExpirationTimeStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentCashForm.orderExpirationTimeValue = context.hour;
            }
            // 自动收货
            if (item.configType === 'order_setting_auto_receive') {
              paymentCashForm.orderConfirmReceiptStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentCashForm.orderConfirmReceiptValue = context.day;
            }
            // 允许退单
            if (item.configType === 'order_setting_apply_refund') {
              paymentCashForm.orderRefundsStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentCashForm.orderRefundsValue = context.day;
            }
            // 待审核退单自动审核
            if (item.configType === 'order_setting_refund_auto_audit') {
              paymentCashForm.orderAutomaticReviewStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentCashForm.orderAutomaticReviewValue = context.day;
            }
            // 自动跳过物流信息采集
            if (item.configType === 'order_setting_refund_auto_fill_logic_info') {
              paymentCashForm.orderAutomaticSkipStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentCashForm.orderAutomaticSkipValue = context.day;
            }
            // 退单自动确认收货
            if (item.configType === 'order_setting_refund_auto_receive') {
              paymentCashForm.orderAutomaticConfirmationStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentCashForm.orderAutomaticConfirmationValue = context.day;
            }
            //自动触发全额退款
            if (item.configType === 'order_setting_refund_auto_refund') {
              paymentCashForm.orderAutomaticTriggerStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentCashForm.orderAutomaticTriggerValue = context.day;
            }
          });

          unLimitedList.map((item) => {
            //订单失效时间
            if (item.configType === 'order_setting_timeout_cancel') {
              unlimitedForm.orderExpirationTimeStatus = !!item.status;
              let context = JSON.parse(item.context);
              unlimitedForm.orderExpirationTimeValue = context.hour;
            }
            // 自动收货
            if (item.configType === 'order_setting_auto_receive') {
              unlimitedForm.orderConfirmReceiptStatus = !!item.status;
              let context = JSON.parse(item.context);
              unlimitedForm.orderConfirmReceiptValue = context.day;
            }
            // 允许退单
            if (item.configType === 'order_setting_apply_refund') {
              unlimitedForm.orderRefundsStatus = !!item.status;
              let context = JSON.parse(item.context);
              unlimitedForm.orderRefundsValue = context.day;
            }
            // 待审核退单自动审核
            if (item.configType === 'order_setting_refund_auto_audit') {
              unlimitedForm.orderAutomaticReviewStatus = !!item.status;
              let context = JSON.parse(item.context);
              unlimitedForm.orderAutomaticReviewValue = context.day;
            }
            // 自动跳过物流信息采集
            if (item.configType === 'order_setting_refund_auto_fill_logic_info') {
              unlimitedForm.orderAutomaticSkipStatus = !!item.status;
              let context = JSON.parse(item.context);
              unlimitedForm.orderAutomaticSkipValue = context.day;

            }
            // 退单自动确认收货
            if (item.configType === 'order_setting_refund_auto_receive') {
              unlimitedForm.orderAutomaticConfirmationStatus = !!item.status;
              let context = JSON.parse(item.context);
              unlimitedForm.orderAutomaticConfirmationValue = context.day;
            }
            //自动触发全额退款
            if (item.configType === 'order_setting_refund_auto_refund') {
              unlimitedForm.orderAutomaticTriggerStatus = !!item.status;
              let context = JSON.parse(item.context);
              unlimitedForm.orderAutomaticTriggerValue = context.day;
            }
          });

          this.setState({
            pcashList,
            ponlineList,
            unLimitedList,
            paymentOnlineForm,
            paymentCashForm,
            unlimitedForm,
            loading: false
          });
        }
        else {
          this.setState({
            loading: false
          })
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        })
      });
  };
  //校验配置项是否符合规范，配置项打开后，必须存在值，否则不能保存
  verifyConfig = (status, value) => {
    if (!status || (status && (value === 0 || value))) {
      return true
    }
    else {
      return false
    }
  }


  updateOrderSettingConfig = () => {
    const { pcashList, ponlineList, sequenceRequestList, unLimitedList, paymentOnlineForm, paymentCashForm, unlimitedForm } = this.state;
    let isVerify = true
    ponlineList.map((item) => {
      if (item.configType === 'order_capture_payment_when') {
          item.context = paymentOnlineForm.paymentWhen;
      }
      //订单失效时间
      if (item.configType === 'order_setting_timeout_cancel') {
        item.status = +paymentOnlineForm.orderExpirationTimeStatus;
        if (this.verifyConfig(item.status, paymentOnlineForm.orderExpirationTimeValue)) {
          let context = {
            hour: paymentOnlineForm.orderExpirationTimeValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 自动收货
      if (item.configType === 'order_setting_auto_receive') {
        item.status = +paymentOnlineForm.orderConfirmReceiptStatus;
        if (this.verifyConfig(item.status, paymentOnlineForm.orderConfirmReceiptValue)) {
          let context = {
            day: paymentOnlineForm.orderConfirmReceiptValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 允许退单
      if (item.configType === 'order_setting_apply_refund') {
        item.status = +paymentOnlineForm.orderRefundsStatus;
        if (this.verifyConfig(item.status, paymentOnlineForm.orderRefundsValue)) {
          let context = {
            day: paymentOnlineForm.orderRefundsValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 待审核退单自动审核
      if (item.configType === 'order_setting_refund_auto_audit') {
        item.status = +paymentOnlineForm.orderAutomaticReviewStatus;
        if (this.verifyConfig(item.status, paymentOnlineForm.orderAutomaticReviewValue)) {
          let context = {
            day: paymentOnlineForm.orderAutomaticReviewValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 自动跳过物流信息采集
      if (item.configType === 'order_setting_refund_auto_fill_logic_info') {
        item.status = +paymentOnlineForm.orderAutomaticSkipStatus;
        if (this.verifyConfig(item.status, paymentOnlineForm.orderAutomaticSkipValue)) {
          let context = {
            day: paymentOnlineForm.orderAutomaticSkipValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 退单自动确认收货
      if (item.configType === 'order_setting_refund_auto_receive') {
        item.status = +paymentOnlineForm.orderAutomaticConfirmationStatus;
        if (this.verifyConfig(item.status, paymentOnlineForm.orderAutomaticConfirmationValue)) {
          let context = {
            day: paymentOnlineForm.orderAutomaticConfirmationValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      //自动触发全额退款
      if (item.configType === 'order_setting_refund_auto_refund') {
        item.status = +paymentOnlineForm.orderAutomaticTriggerStatus;
        if (this.verifyConfig(item.status, paymentOnlineForm.orderAutomaticTriggerValue)) {
          let context = {
            day: paymentOnlineForm.orderAutomaticTriggerValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      //允许0元订单
      if (item.configType === 'order_setting_zero_order') {
        item.status = +paymentOnlineForm.orderAllowZonePriceStatus;
        if (this.verifyConfig(item.status, paymentOnlineForm.orderAllowZonePriceValue)) {
          let context = {
            hour: paymentOnlineForm.orderAllowZonePriceValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
    });
    if (!isVerify) {
      return message.error(RCi18n({ id: 'Order.settingTips' }))
    }

    pcashList.map((item) => {
      if (item.configType === 'order_capture_payment_when') {
        item.context = paymentCashForm.paymentWhen;
      }
      //订单失效时间
      if (item.configType === 'order_setting_timeout_cancel') {
        item.status = +paymentCashForm.orderExpirationTimeStatus;
        if (this.verifyConfig(item.status, paymentCashForm.orderExpirationTimeValue)) {
          let context = {
            hour: paymentCashForm.orderExpirationTimeValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 自动收货
      if (item.configType === 'order_setting_auto_receive') {
        item.status = +paymentCashForm.orderConfirmReceiptStatus;
        if (this.verifyConfig(item.status, paymentCashForm.orderConfirmReceiptValue)) {
          let context = {
            day: paymentCashForm.orderConfirmReceiptValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 允许退单
      if (item.configType === 'order_setting_apply_refund') {
        item.status = +paymentCashForm.orderRefundsStatus;
        if (this.verifyConfig(item.status, paymentCashForm.orderRefundsValue)) {
          let context = {
            day: paymentCashForm.orderRefundsValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 待审核退单自动审核
      if (item.configType === 'order_setting_refund_auto_audit') {
        item.status = +paymentCashForm.orderAutomaticReviewStatus;
        if (this.verifyConfig(item.status, paymentCashForm.orderAutomaticReviewValue)) {
          let context = {
            day: paymentCashForm.orderAutomaticReviewValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 自动跳过物流信息采集
      if (item.configType === 'order_setting_refund_auto_fill_logic_info') {
        item.status = +paymentCashForm.orderAutomaticSkipStatus;
        if (this.verifyConfig(item.status, paymentCashForm.orderAutomaticSkipValue)) {
          let context = {
            day: paymentCashForm.orderAutomaticSkipValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 退单自动确认收货
      if (item.configType === 'order_setting_refund_auto_receive') {
        item.status = +paymentCashForm.orderAutomaticConfirmationStatus;
        if (this.verifyConfig(item.status, paymentCashForm.orderAutomaticConfirmationValue)) {
          let context = {
            day: paymentCashForm.orderAutomaticConfirmationValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      //自动触发全额退款
      if (item.configType === 'order_setting_refund_auto_refund') {
        item.status = +paymentCashForm.orderAutomaticTriggerStatus;
        if (this.verifyConfig(item.status, paymentCashForm.orderAutomaticTriggerValue)) {
          let context = {
            day: paymentCashForm.orderAutomaticTriggerValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
    });
    if (!isVerify) {
      return message.error(RCi18n({ id: 'Order.settingTips' }))
    }

    unLimitedList.map((item) => {
      //订单失效时间
      if (item.configType === 'order_setting_timeout_cancel') {
        item.status = +unlimitedForm.orderExpirationTimeStatus;
        if (this.verifyConfig(item.status, unlimitedForm.orderExpirationTimeValue)) {
          let context = {
            hour: unlimitedForm.orderExpirationTimeValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 自动收货
      if (item.configType === 'order_setting_auto_receive') {
        item.status = +unlimitedForm.orderConfirmReceiptStatus;
        if (this.verifyConfig(item.status, unlimitedForm.orderConfirmReceiptValue)) {
          let context = {
            day: unlimitedForm.orderConfirmReceiptValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 允许退单
      if (item.configType === 'order_setting_apply_refund') {
        item.status = +unlimitedForm.orderRefundsStatus;
        if (this.verifyConfig(item.status, unlimitedForm.orderRefundsValue)) {
          let context = {
            day: unlimitedForm.orderRefundsValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 待审核退单自动审核
      if (item.configType === 'order_setting_refund_auto_audit') {
        item.status = +unlimitedForm.orderAutomaticReviewStatus;
        if (this.verifyConfig(item.status, unlimitedForm.orderAutomaticReviewValue)) {
          let context = {
            day: unlimitedForm.orderAutomaticReviewValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 自动跳过物流信息采集
      if (item.configType === 'order_setting_refund_auto_fill_logic_info') {
        item.status = +unlimitedForm.orderAutomaticSkipStatus;
        if (this.verifyConfig(item.status, unlimitedForm.orderAutomaticSkipValue)) {
          let context = {
            day: unlimitedForm.orderAutomaticSkipValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      // 退单自动确认收货
      if (item.configType === 'order_setting_refund_auto_receive') {
        item.status = +unlimitedForm.orderAutomaticConfirmationStatus;
        if (this.verifyConfig(item.status, unlimitedForm.orderAutomaticConfirmationValue)) {
          let context = {
            day: unlimitedForm.orderAutomaticConfirmationValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return
        }
      }
      //自动触发全额退款
      if (item.configType === 'order_setting_refund_auto_refund') {
        item.status = +unlimitedForm.orderAutomaticTriggerStatus;
        if (this.verifyConfig(item.status, unlimitedForm.orderAutomaticTriggerValue)) {
          let context = {
            day: unlimitedForm.orderAutomaticTriggerValue
          };
          item.context = JSON.stringify(context);
        }
        else {
          isVerify = false
          return

        }
      }
    });
    if (!isVerify) {
      return message.error(RCi18n({ id: 'Order.settingTips' }))
    }

    let params = {
      orderConfigModifyRequest: {
        pcashList: pcashList,
        ponlineList: ponlineList,
        unLimitedList: unLimitedList,
      },
      sequenceRequestList
    };
    this.setState({
      btnLoading: true
    })
    webapi
      .updateOrderSettingConfig(params)
      .then((data) => {

        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || RCi18n({ id: 'Order.SaveSuccessful' }));
          this.setState({
            btnLoading: false
          })
        } else {
          this.setState({
            btnLoading: false
          })
        }
      })
      .catch((err) => {
        this.setState({
          btnLoading: false
        })
      });
  };



  render() {
    const { title, loading, btnLoading, message, paymentOnlineForm, sequenceRequestList, paymentCashForm, unlimitedForm, paymentCategory, fieldForm } = this.state;
    const description = (
      <div>
        <p><FormattedMessage id="Order.Ordersution" /></p>
        <p><FormattedMessage id="Order.IfTheCustomer" /></p>
        <p><FormattedMessage id="Order.IfTheCmpleted" /></p>
        <p><FormattedMessage id="Order.ThePending" /></p>
        <p><FormattedMessage id="Order.TheMerchant" /></p>
      </div>
    );

    const filedType = {
      order: <FormattedMessage id="Order.OrderNumber" />,
      subscription: <FormattedMessage id="Order.SubscriptionNumber" />,
      return: <FormattedMessage id="Order.ReturnOrderNumber" />
    }


    return (
      <AuthWrapper functionName="f_order_setting_1">
        <Spin spinning={loading}>

          <BreadCrumb />
          {/*导航面包屑*/}
          <div className="container-search">
            <Headline title={title} />
            <Alert message={message} description={description} type="error" />

            {/* <p style={styles.tipsStyle}>Select "Payment before delivery", the customer must pay for the order before the merchant can ship, select "Unlimited", regardless of whether the customer pays or not</p> */}
            <Tabs defaultActiveKey="Delivery after payment" style={{ marginTop: 20 }}>
              <TabPane tab={<FormattedMessage id="Order.deliveryAfterPayment" />} key="Delivery after payment">
                <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="right">
                  <FormItem label={<FormattedMessage id="Order.PaymentCategory" />}>
                    <div>
                      <Radio.Group onChange={this.handleCategoryChange} value={paymentCategory}>
                        <Radio style={{ width: 140, textAlign: 'center' }} value="Online payment">
                          <FormattedMessage id="Order.OnlinePayment" />
                        </Radio>
                        <Radio style={{ width: 140, textAlign: 'center' }} value="Cash">
                          <FormattedMessage id="Order.Cash" />
                        </Radio>
                      </Radio.Group>
                    </div>
                  </FormItem>

                  {/*<FormItem label={<FormattedMessage id="Order.capturePaymentWhen" />}>*/}
                  {/*  <Row>*/}
                  {/*    <Select*/}
                  {/*      value={paymentCategory === 'Online payment' ? paymentOnlineForm.paymentWhen : paymentCashForm.paymentWhen}*/}
                  {/*      style={{ width: 140 }}*/}
                  {/*      onChange={(value) => {*/}
                  {/*        if (paymentCategory === 'Online payment') {*/}
                  {/*          this.paymentOnlineFormChange({*/}
                  {/*            field: 'paymentWhen',*/}
                  {/*            value: value*/}
                  {/*          });*/}
                  {/*        } else {*/}
                  {/*          this.paymentCashFormChange({*/}
                  {/*            field: 'paymentWhen',*/}
                  {/*            value: value*/}
                  {/*          });*/}
                  {/*        }*/}
                  {/*      }}*/}
                  {/*    >*/}
                  {/*      <Option value="None"><FormattedMessage id="Order.none" /></Option>*/}
                  {/*      <Option value="To be delivered"><FormattedMessage id="Order.toBeDelivered" /></Option>*/}
                  {/*      <Option value="Shipped"><FormattedMessage id="Order.Shipped" /></Option>*/}
                  {/*    </Select>*/}
                  {/*  </Row>*/}
                  {/*</FormItem>*/}
                  <FormItem>
                    <strong> Sales order setting </strong>
                  </FormItem>
                  {paymentCategory === 'Online payment' ? (
                    <>
                      <FormItem label={<FormattedMessage id="Order.OrderExpirationTime" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentOnlineForm.orderExpirationTimeStatus}
                          onChange={(value) =>
                            this.paymentOnlineFormChange({
                              field: 'orderExpirationTimeStatus',
                              value: value
                            })
                          }
                        />
                        {paymentOnlineForm.orderExpirationTimeStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={1}
                                min={0.1}
                                max={9999.9}
                                value={paymentOnlineForm.orderExpirationTimeValue}
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderExpirationTimeValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterHours" /></span>
                            </div>
                        ) : null}
                      </FormItem>

                      <FormItem label={<FormattedMessage id="Order.Automatically" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentOnlineForm.orderConfirmReceiptStatus}
                          onChange={(value) =>
                            this.paymentOnlineFormChange({
                              field: 'orderConfirmReceiptStatus',
                              value: value
                            })
                          }
                        />
                        {paymentOnlineForm.orderConfirmReceiptStatus ? (
                            <div style={styles.inputStyle}>
                              {/*<span>After</span>*/}
                              <InputNumber
                                precision={0}
                                min={1}
                                max={9999}
                                // style={{ margin: '0 5px' }}
                                value={paymentOnlineForm.orderConfirmReceiptValue}
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderConfirmReceiptValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDays" /></span>
                              {/*<span > days of </span>*/}
                              {/*    <Select*/}
                              {/*      value={paymentCategory === 'Online payment' ? paymentOnlineForm.statusChangeWhen : paymentCashForm.statusChangeWhen}*/}
                              {/*      style={{ width: 140 }}*/}
                              {/*      onChange={(value) => {*/}
                              {/*        if (paymentCategory === 'Online payment') {*/}
                              {/*          this.paymentOnlineFormChange({*/}
                              {/*            field: 'statusChangeWhen',*/}
                              {/*            value: value*/}
                              {/*          });*/}
                              {/*        } else {*/}
                              {/*          this.paymentCashFormChange({*/}
                              {/*            field: 'statusChangeWhen',*/}
                              {/*            value: value*/}
                              {/*          });*/}
                              {/*        }*/}
                              {/*      }}*/}
                              {/*    >*/}
                              {/*      <Option value="delivered">delivered</Option>*/}
                              {/*      <Option value="shipped"><FormattedMessage id="Order.Shipped" /></Option>*/}
                              {/*    </Select>*/}
                              {/*<span style={{ margin: '0 10px' }}>status,</span>*/}
                              {/*<span >*/}
                              {/*  the pending review return orders will be automatically approved.</span>*/}
                            </div>
                        ) : null}
                      </FormItem>

                      <FormItem label={<FormattedMessage id="Order.AllowZoneOrder" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentOnlineForm.orderAllowZonePriceStatus}
                          onChange={(value) =>
                            this.paymentOnlineFormChange({
                              field: 'orderAllowZonePriceStatus',
                              value: value
                            })
                          }
                        />
                      </FormItem>

                      <FormItem> <strong> Return order setting </strong> </FormItem>

                      <FormItem label={<FormattedMessage id="Order.Automaticskip" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentOnlineForm.orderAutomaticSkipStatus}
                          onChange={(value) =>
                            this.paymentOnlineFormChange({
                              field: 'orderAutomaticSkipStatus',
                              value: value
                            })
                          }
                        />
                        {paymentOnlineForm.orderAutomaticSkipStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={0}
                                max={9999}
                                value={paymentOnlineForm.orderAutomaticSkipValue}
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderAutomaticSkipValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysLogistics" /></span>
                            </div>
                        ) : null}
                      </FormItem>
                      <FormItem label={<FormattedMessage id="Order.CompletedOrders" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentOnlineForm.orderRefundsStatus}
                          onChange={(value) =>
                            this.paymentOnlineFormChange({
                              field: 'orderRefundsStatus',
                              value: value
                            })
                          }
                        />
                        {paymentOnlineForm.orderRefundsStatus ? (
                          <div style={styles.inputStyle}>
                            <InputNumber
                              precision={0}
                              min={1}
                              max={9999}
                              value={paymentOnlineForm.orderRefundsValue}
                              onChange={(value) =>
                                this.paymentOnlineFormChange({
                                  field: 'orderRefundsValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.applyRefunds" /></span>
                          </div>
                        ) : null}
                      </FormItem>
                      <FormItem label={<FormattedMessage id="Order.Automatic" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentOnlineForm.orderAutomaticReviewStatus}
                          onChange={(value) =>
                            this.paymentOnlineFormChange({
                              field: 'orderAutomaticReviewStatus',
                              value: value
                            })
                          }
                        />
                        {paymentOnlineForm.orderAutomaticReviewStatus ? (
                          <div style={styles.inputStyle}>
                            <InputNumber
                              precision={0}
                              min={0}
                              max={9999}
                              value={paymentOnlineForm.orderAutomaticReviewValue}
                              onChange={(value) =>
                                this.paymentOnlineFormChange({
                                  field: 'orderAutomaticReviewValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysMerchant" /></span>
                          </div>
                        ) : null}
                      </FormItem>

                      <FormItem label={<FormattedMessage id="Order.AutomaticConfirmation" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentOnlineForm.orderAutomaticConfirmationStatus}
                          onChange={(value) =>
                            this.paymentOnlineFormChange({
                              field: 'orderAutomaticConfirmationStatus',
                              value: value
                            })
                          }
                        />
                        {paymentOnlineForm.orderAutomaticConfirmationStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={0}
                                max={9999}
                                value={paymentOnlineForm.orderAutomaticConfirmationValue}
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderAutomaticConfirmationValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>
                                {' '}
                                <FormattedMessage id="Order.AfterDaysAutomatically" />
                              </span>
                            </div>
                        ) : null}
                      </FormItem>

                      <FormItem label={<FormattedMessage id="Order.Automatictrigger" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentOnlineForm.orderAutomaticTriggerStatus}
                          onChange={(value) =>
                            this.paymentOnlineFormChange({
                              field: 'orderAutomaticTriggerStatus',
                              value: value
                            })
                          }
                        />
                        {paymentOnlineForm.orderAutomaticTriggerStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={0}
                                max={9999}
                                value={paymentOnlineForm.orderAutomaticTriggerValue}
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderAutomaticTriggerValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysFullrefund" /></span>
                            </div>
                        ) : null}
                      </FormItem>
                    </>
                  ) : null}
                  {paymentCategory === 'Cash' ? (
                    <>
                      <FormItem label={<FormattedMessage id="Order.OrderExpirationTime" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentCashForm.orderExpirationTimeStatus}
                          onChange={(value) =>
                            this.paymentCashFormChange({
                              field: 'orderExpirationTimeStatus',
                              value: value
                            })
                          }
                        />
                        {paymentCashForm.orderExpirationTimeStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={1}
                                min={0.1}
                                max={9999.9}
                                value={paymentCashForm.orderExpirationTimeValue}
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderExpirationTimeValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterHours" /></span>
                            </div>
                        ) : null}
                      </FormItem>

                      <FormItem label={<FormattedMessage id="Order.AutomaticallyConfirm" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentCashForm.orderConfirmReceiptStatus}
                          onChange={(value) =>
                            this.paymentCashFormChange({
                              field: 'orderConfirmReceiptStatus',
                              value: value
                            })
                          }
                        />
                        {paymentCashForm.orderConfirmReceiptStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={1}
                                max={9999}
                                value={paymentCashForm.orderConfirmReceiptValue}
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderConfirmReceiptValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysCustomer" /></span>
                            </div>
                        ) : null}
                      </FormItem>
                      <FormItem> <strong> Return order setting </strong> </FormItem>
                      <FormItem label={<FormattedMessage id="Order.Automaticskip" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentCashForm.orderAutomaticSkipStatus}
                          onChange={(value) =>
                            this.paymentCashFormChange({
                              field: 'orderAutomaticSkipStatus',
                              value: value
                            })
                          }
                        />
                        {paymentCashForm.orderAutomaticSkipStatus ? (
                          <div style={styles.inputStyle}>
                            <InputNumber
                              precision={0}
                              min={0}
                              max={9999}
                              value={paymentCashForm.orderAutomaticSkipValue}
                              onChange={(value) =>
                                this.paymentCashFormChange({
                                  field: 'orderAutomaticSkipValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysLogistics" /></span>
                          </div>
                        ) : null}
                      </FormItem>

                      <FormItem label={<FormattedMessage id="Order.CompletedOrdersAllowed" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentCashForm.orderRefundsStatus}
                          onChange={(value) =>
                            this.paymentCashFormChange({
                              field: 'orderRefundsStatus',
                              value: value
                            })
                          }
                        />
                        {paymentCashForm.orderRefundsStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={1}
                                max={9999}
                                value={paymentCashForm.orderRefundsValue}
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderRefundsValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.applyRefunds" /></span>
                            </div>
                        ) : null}
                      </FormItem>

                      <FormItem label={<FormattedMessage id="Order.AutomaticReview" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentCashForm.orderAutomaticReviewStatus}
                          onChange={(value) =>
                            this.paymentCashFormChange({
                              field: 'orderAutomaticReviewStatus',
                              value: value
                            })
                          }
                        />
                        {paymentCashForm.orderAutomaticReviewStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={0}
                                max={9999}
                                value={paymentCashForm.orderAutomaticReviewValue}
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderAutomaticReviewValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysTheMerchant" /></span>
                            </div>
                        ) : null}
                      </FormItem>
                      <FormItem label={<FormattedMessage id="Order.AutomaticReceipt" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentCashForm.orderAutomaticConfirmationStatus}
                          onChange={(value) =>
                            this.paymentCashFormChange({
                              field: 'orderAutomaticConfirmationStatus',
                              value: value
                            })
                          }
                        />
                        {paymentCashForm.orderAutomaticConfirmationStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={0}
                                max={9999}
                                value={paymentCashForm.orderAutomaticConfirmationValue}
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderAutomaticConfirmationValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>
                                {' '}
                                <FormattedMessage id="Order.AfterTheMerchant" />
                              </span>
                            </div>
                        ) : null}
                      </FormItem>
                      <FormItem label={<FormattedMessage id="Order.Automatictrigger" />}>
                        <Switch
                          checkedChildren={RCi18n({ id: 'Order.On' })}
                          unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                          checked={paymentCashForm.orderAutomaticTriggerStatus}
                          onChange={(value) =>
                            this.paymentCashFormChange({
                              field: 'orderAutomaticTriggerStatus',
                              value: value
                            })
                          }
                        />
                        {paymentCashForm.orderAutomaticTriggerStatus ? (
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={0}
                                max={9999}
                                value={paymentCashForm.orderAutomaticTriggerValue}
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderAutomaticTriggerValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysFullrefund" /></span>
                            </div>
                        ) : null}
                      </FormItem>
                    </>
                  ) : null}
                </Form>
              </TabPane>
              <TabPane tab={<FormattedMessage id="Order.cashOnDelivery" />} key="Cash on delivery">
                <Form style={{ marginTop: 20 }} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="right">
                  <FormItem><strong> Sales order setting </strong></FormItem>
                  <FormItem label={<FormattedMessage id="Order.OrderExpirationTime" />}>
                    <Switch
                      checkedChildren={RCi18n({ id: 'Order.On' })}
                      unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                      checked={unlimitedForm.orderExpirationTimeStatus}
                      onChange={(value) =>
                        this.unlimitedFormChange({
                          field: 'orderExpirationTimeStatus',
                          value: value
                        })
                      }
                    />
                    {unlimitedForm.orderExpirationTimeStatus ? (
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={1}
                            min={0.1}
                            max={9999.9}
                            value={unlimitedForm.orderExpirationTimeValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderExpirationTimeValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterHours" /></span>
                        </div>
                    ) : null}
                  </FormItem>
                  <FormItem label={<FormattedMessage id="Order.Automatically" />}>
                    <Switch
                      checkedChildren={RCi18n({ id: 'Order.On' })}
                      unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                      checked={unlimitedForm.orderConfirmReceiptStatus}
                      onChange={(value) =>
                        this.unlimitedFormChange({
                          field: 'orderConfirmReceiptStatus',
                          value: value
                        })
                      }
                    />
                    {unlimitedForm.orderConfirmReceiptStatus ? (
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={0}
                            min={1}
                            max={9999}
                            value={unlimitedForm.orderConfirmReceiptValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderConfirmReceiptValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDays" /></span>
                        </div>
                    ) : null}
                  </FormItem>
                  <FormItem><strong> Return order setting </strong></FormItem>
                  <FormItem label={<FormattedMessage id="Order.CompletedOrders" />}>
                    <Switch
                      checkedChildren={RCi18n({ id: 'Order.On' })}
                      unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                      checked={unlimitedForm.orderRefundsStatus}
                      onChange={(value) =>
                        this.unlimitedFormChange({
                          field: 'orderRefundsStatus',
                          value: value
                        })
                      }
                    />
                    {unlimitedForm.orderRefundsStatus ? (
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={0}
                            min={1}
                            max={9999}
                            value={unlimitedForm.orderRefundsValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderRefundsValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.applyRefunds" /></span>
                        </div>
                    ) : null}
                  </FormItem>

                  <FormItem label={<FormattedMessage id="Order.Automatic" />}>
                    <Switch
                      checkedChildren={RCi18n({ id: 'Order.On' })}
                      unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                      checked={unlimitedForm.orderAutomaticReviewStatus}
                      onChange={(value) =>
                        this.unlimitedFormChange({
                          field: 'orderAutomaticReviewStatus',
                          value: value
                        })
                      }
                    />
                    {unlimitedForm.orderAutomaticReviewStatus ? (
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={0}
                            min={0}
                            max={9999}
                            value={unlimitedForm.orderAutomaticReviewValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderAutomaticReviewValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}>{<FormattedMessage id="Order.AfterDaysMerchant" />}</span>
                        </div>
                    ) : null}
                  </FormItem>
                  <FormItem label={<FormattedMessage id="Order.Automaticskip" />}>
                    <Switch
                      checkedChildren={RCi18n({ id: 'Order.On' })}
                      unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                      checked={unlimitedForm.orderAutomaticSkipStatus}
                      onChange={(value) =>
                        this.unlimitedFormChange({
                          field: 'orderAutomaticSkipStatus',
                          value: value
                        })
                      }
                    />
                    {unlimitedForm.orderAutomaticSkipStatus ? (
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={0}
                            min={0}
                            max={9999}
                            value={unlimitedForm.orderAutomaticSkipValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderAutomaticSkipValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysLogistics" /></span>
                        </div>
                    ) : null}
                  </FormItem>
                  <FormItem label={<FormattedMessage id="Order.AutomaticConfirmation" />}>
                    <Switch
                      checkedChildren={RCi18n({ id: 'Order.On' })}
                      unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                      checked={unlimitedForm.orderAutomaticConfirmationStatus}
                      onChange={(value) =>
                        this.unlimitedFormChange({
                          field: 'orderAutomaticConfirmationStatus',
                          value: value
                        })
                      }
                    />
                    {unlimitedForm.orderAutomaticConfirmationStatus ? (
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={0}
                            min={0}
                            max={9999}
                            value={unlimitedForm.orderAutomaticConfirmationValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderAutomaticConfirmationValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}>
                            {' '}
                            <FormattedMessage id="Order.AfterDaysAutomatically" />
                          </span>
                        </div>
                    ) : null}
                  </FormItem>
                  <FormItem label={<FormattedMessage id="Order.Automatictrigger" />}>
                    <Switch
                      checkedChildren={RCi18n({ id: 'Order.On' })}
                      unCheckedChildren={RCi18n({ id: 'Order.Off' })}
                      checked={unlimitedForm.orderAutomaticTriggerStatus}
                      onChange={(value) =>
                        this.unlimitedFormChange({
                          field: 'orderAutomaticTriggerStatus',
                          value: value
                        })
                      }
                    />
                    {unlimitedForm.orderAutomaticTriggerStatus ? (
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={0}
                            min={0}
                            max={9999}
                            value={unlimitedForm.orderAutomaticTriggerValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderAutomaticTriggerValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}><FormattedMessage id="Order.AfterDaysFullrefund" /></span>
                        </div>
                    ) : null}
                  </FormItem>
                </Form>
              </TabPane>
              <TabPane tab={<FormattedMessage id="Order.fieldRuleSetting" />} key="Filed rule setting">
                <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 10 }} labelAlign="right">
                  {sequenceRequestList.map((item, index) => {

                    return (
                      <FormItem label={filedType[item.sequenceType]} key={item.sequenceType}>
                        <div style={{ display: 'flex' }}>
                          <Button >Prefix</Button> &nbsp;&nbsp;
                          <Input  style={{ width: 100, margin: '0 20px'}} value={item.prefix} onChange={(e) => this.changeInputValue(e, 'prefix', index)} />
                          {/*<Input style={{ width: 100, }} value={item.currentValue} onChange={(e) => this.changeInputValue(e, 'currentValue', index)} />*/}
                          <InputNumber style={{ width: 120, margin: '0 20px' }} onChange={(e) => this.changeInputValue(e, 'sequenceBits', index)} value={item.sequenceBits} min={8} max={12} />
                          <sup className="ant-form-item-required"></sup>
                        </div>
                      </FormItem>
                    )


                  })}
                  <Row>
                    <Col span={13}></Col>
                    <Col> <a className="ant-form-item-required"></a> Order Number Length </Col>
                  </Row>                  {/* <FormItem label={<FormattedMessage id="Order.SubscriptionNumber" />}>
                    <Input addonBefore="SRCF" value={fieldForm.subscriptionField} />
                  </FormItem>
                  <FormItem label={<FormattedMessage id="Order.ReturnOrderNumber" />}>
                    <Input addonBefore="RRCF" value={fieldForm.returnOrderField} />
                  </FormItem> */}
                </Form>
              </TabPane>
            </Tabs>
          </div>
          <div className="bar-button">
            <Button loading={btnLoading} type="primary" style={{ marginRight: 10 }} onClick={() => this.updateOrderSettingConfig()}>
              {<FormattedMessage id="Order.save" />}
            </Button>
          </div>
        </Spin>
      </AuthWrapper>
    );
  }
  changeInputValue = (e, key, index) => {
    const { sequenceRequestList } = this.state;
    let value = e.target && e.target.value || e
    let findFiled = sequenceRequestList[index]
    findFiled[key] = value;
    this.setState({
      sequenceRequestList
    })
  }


}
const styles = {
  inputStyle: {
    display: 'inline-block',
    marginLeft: '20px'
  },
  tipsStyle: {
    fontSize: 16,
    lineHeight: 1,
    margin: '20px 0 10px 0'
  }
} as any;

export default Form.create()(injectIntl(OrderSetting));
