import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Switch, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import './index.less';
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Option } = Select;

class OrderSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Order Setting',
      message: 'Operation tips',
      paymentSequence: 'Payment before delivery',
      paymentCategory: 'Online payment',
      paymentOnlineForm: {
        orderExpirationTimeStatus: false,
        orderExpirationTimeValue: 1,
        orderConfirmReceiptStatus: false,
        orderConfirmReceiptValue: 1,
        orderRefundsStatus: false,
        orderRefundsValue: 1,
        orderAutomaticReviewStatus: false,
        orderAutomaticReviewValue: 1,
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 1,
        paymentWhen: 'None'
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
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 1,
        paymentWhen: 'None'
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
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 1
      },
      pcashList: [],
      ponlineList: [],
      unLimitedList: []
    };
  }
  componentDidMount() {
    this.getOrderSettingConfig();
  }

  handleCategoryChange = (e) => {
    this.setState({
      paymentCategory: e.target.value
    });
  };

  paymentOnlineFormChange = ({ field, value }) => {
    if (!value && value !== false) {
      value = 1;
    }
    let data = this.state.paymentOnlineForm;
    data[field] = value;
    this.setState({
      paymentOnlineForm: data
    });
  };
  paymentCashFormChange = ({ field, value }) => {
    if (!value && value !== false) {
      value = 1;
    }
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
    if (!value && value !== false) {
      value = 1;
    }
    let data = this.state.unlimitedForm;
    data[field] = value;
    this.setState({
      unlimitedForm: data
    });
  };

  getOrderSettingConfig = () => {
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
            // 退单自动确认收货
            if (item.configType === 'order_setting_refund_auto_receive') {
              paymentOnlineForm.orderAutomaticConfirmationStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentOnlineForm.orderAutomaticConfirmationValue = context.day;
            }
          });

          pcashList.map((item) => {
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
            // 退单自动确认收货
            if (item.configType === 'order_setting_refund_auto_receive') {
              paymentCashForm.orderAutomaticConfirmationStatus = !!item.status;
              let context = JSON.parse(item.context);
              paymentCashForm.orderAutomaticConfirmationValue = context.day;
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
            // 退单自动确认收货
            if (item.configType === 'order_setting_refund_auto_receive') {
              unlimitedForm.orderAutomaticConfirmationStatus = !!item.status;
              let context = JSON.parse(item.context);
              unlimitedForm.orderAutomaticConfirmationValue = context.day;
            }
          });

          this.setState({
            pcashList,
            ponlineList,
            unLimitedList,
            paymentOnlineForm,
            paymentCashForm,
            unlimitedForm
          });
        }
      })
      .catch((err) => {});
  };

  updateOrderSettingConfig = () => {
    const { pcashList, ponlineList, unLimitedList, paymentOnlineForm, paymentCashForm, unlimitedForm } = this.state;
    ponlineList.map((item) => {
      //订单失效时间
      if (item.configType === 'order_setting_timeout_cancel') {
        item.status = +paymentOnlineForm.orderExpirationTimeStatus;
        let context = {
          hour: paymentOnlineForm.orderExpirationTimeValue
        };
        item.context = JSON.stringify(context);
      }
      // 自动收货
      if (item.configType === 'order_setting_auto_receive') {
        item.status = +paymentOnlineForm.orderConfirmReceiptStatus;
        let context = {
          day: paymentOnlineForm.orderConfirmReceiptValue
        };
        item.context = JSON.stringify(context);
      }
      // 允许退单
      if (item.configType === 'order_setting_apply_refund') {
        item.status = +paymentOnlineForm.orderRefundsStatus;
        let context = {
          day: paymentOnlineForm.orderRefundsValue
        };
        item.context = JSON.stringify(context);
      }
      // 待审核退单自动审核
      if (item.configType === 'order_setting_refund_auto_audit') {
        item.status = +paymentOnlineForm.orderAutomaticReviewStatus;
        let context = {
          day: paymentOnlineForm.orderAutomaticReviewValue
        };
        item.context = JSON.stringify(context);
      }
      // 退单自动确认收货
      if (item.configType === 'order_setting_refund_auto_receive') {
        item.status = +paymentOnlineForm.orderAutomaticConfirmationStatus;
        let context = {
          day: paymentOnlineForm.orderAutomaticConfirmationValue
        };
        item.context = JSON.stringify(context);
      }
    });

    pcashList.map((item) => {
      //订单失效时间
      if (item.configType === 'order_setting_timeout_cancel') {
        item.status = +paymentCashForm.orderExpirationTimeStatus;
        let context = {
          hour: paymentCashForm.orderExpirationTimeValue
        };
        item.context = JSON.stringify(context);
      }
      // 自动收货
      if (item.configType === 'order_setting_auto_receive') {
        item.status = +paymentCashForm.orderConfirmReceiptStatus;
        let context = {
          day: paymentCashForm.orderConfirmReceiptValue
        };
        item.context = JSON.stringify(context);
      }
      // 允许退单
      if (item.configType === 'order_setting_apply_refund') {
        item.status = +paymentCashForm.orderRefundsStatus;
        let context = {
          day: paymentCashForm.orderRefundsValue
        };
        item.context = JSON.stringify(context);
      }
      // 待审核退单自动审核
      if (item.configType === 'order_setting_refund_auto_audit') {
        item.status = +paymentCashForm.orderAutomaticReviewStatus;
        let context = {
          day: paymentCashForm.orderAutomaticReviewValue
        };
        item.context = JSON.stringify(context);
      }
      // 退单自动确认收货
      if (item.configType === 'order_setting_refund_auto_receive') {
        item.status = +paymentCashForm.orderAutomaticConfirmationStatus;
        let context = {
          day: paymentCashForm.orderAutomaticConfirmationValue
        };
        item.context = JSON.stringify(context);
      }
    });

    unLimitedList.map((item) => {
      //订单失效时间
      if (item.configType === 'order_setting_timeout_cancel') {
        item.status = +unlimitedForm.orderExpirationTimeStatus;
        let context = {
          hour: unlimitedForm.orderExpirationTimeValue
        };
        item.context = JSON.stringify(context);
      }
      // 自动收货
      if (item.configType === 'order_setting_auto_receive') {
        item.status = +unlimitedForm.orderConfirmReceiptStatus;
        let context = {
          day: unlimitedForm.orderConfirmReceiptValue
        };
        item.context = JSON.stringify(context);
      }
      // 允许退单
      if (item.configType === 'order_setting_apply_refund') {
        item.status = +unlimitedForm.orderRefundsStatus;
        let context = {
          day: unlimitedForm.orderRefundsValue
        };
        item.context = JSON.stringify(context);
      }
      // 待审核退单自动审核
      if (item.configType === 'order_setting_refund_auto_audit') {
        item.status = +unlimitedForm.orderAutomaticReviewStatus;
        let context = {
          day: unlimitedForm.orderAutomaticReviewValue
        };
        item.context = JSON.stringify(context);
      }
      // 退单自动确认收货
      if (item.configType === 'order_setting_refund_auto_receive') {
        item.status = +unlimitedForm.orderAutomaticConfirmationStatus;
        let context = {
          day: unlimitedForm.orderAutomaticConfirmationValue
        };
        item.context = JSON.stringify(context);
      }
    });

    let params = {
      pcashList: pcashList,
      ponlineList: ponlineList,
      unLimitedList: unLimitedList
    };
    webapi
      .updateOrderSettingConfig(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || 'Save Successful');
        }
      })
      .catch((err) => {});
  };

  render() {
    const { title, message, paymentOnlineForm, paymentCashForm, unlimitedForm, paymentCategory } = this.state;
    const description = (
      <div>
        <p>1. Order settings are associated with the key process of order return processing, please operate with caution, all settings will take effect after clicking Save.</p>
        <p>2. If the customer has overdue and unprocessed orders to be received, the receipt will be automatically confirmed.</p>
        <p>3. If the completed order exceeds the set time, the customer will not be able to initiate a return or refund application.</p>
        <p>4. The pending refund orders that have not been processed by the merchant will be automatically approved.</p>
        <p>5. The merchant will automatically confirm the receipt of the pending return orders that have not been processed by the merchant.</p>
      </div>
    );

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Alert message={message} description={description} type="error" />

          <p style={styles.tipsStyle}>Select "Payment before delivery", the customer must pay for the order before the merchant can ship, select "Unlimited", regardless of whether the customer pays or not</p>
          <Tabs defaultActiveKey="Payment before delivery">
            <TabPane tab="Payment before delivery" key="Payment before delivery">
              <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="right">
                <FormItem label="Payment category">
                  <div>
                    <Radio.Group onChange={this.handleCategoryChange} value={paymentCategory}>
                      <Radio.Button style={{ width: 140, textAlign: 'center' }} value="Online payment">
                        Online payment
                      </Radio.Button>
                      <Radio.Button style={{ width: 140, textAlign: 'center' }} value="Cash">
                        Cash
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </FormItem>

                <FormItem label="Capture payment when">
                  <Row>
                    <Select
                      value={paymentCategory === 'Online payment' ? paymentOnlineForm.paymentWhen : paymentCashForm.paymentWhen}
                      style={{ width: 140 }}
                      onChange={(value) => {
                        if (paymentCategory === 'Online payment') {
                          this.paymentOnlineFormChange({
                            field: 'paymentWhen',
                            value: value
                          });
                        } else {
                          this.paymentCashFormChange({
                            field: 'paymentWhen',
                            value: value
                          });
                        }
                      }}
                    >
                      <Option value="None">None</Option>
                      <Option value="To be delivered">To be delivered</Option>
                      <Option value="Shipped">Shipped</Option>
                    </Select>
                  </Row>
                </FormItem>
                {paymentCategory === 'Online payment' ? (
                  <>
                    <FormItem label="Order expiration time">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentOnlineForm.orderExpirationTimeStatus}
                            onChange={(value) =>
                              this.paymentOnlineFormChange({
                                field: 'orderExpirationTimeStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentOnlineForm.orderExpirationTimeStatus ? (
                          <Col span={20}>
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
                              <span style={{ marginLeft: 10 }}>After hours, if the customer fails to pay overdue, the order will be automatically voided.</span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>

                    <FormItem label="Automatically confirm receipt of order">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentOnlineForm.orderConfirmReceiptStatus}
                            onChange={(value) =>
                              this.paymentOnlineFormChange({
                                field: 'orderConfirmReceiptStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentOnlineForm.orderConfirmReceiptStatus ? (
                          <Col span={20}>
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={1}
                                max={9999}
                                value={paymentOnlineForm.orderConfirmReceiptValue}
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderConfirmReceiptValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>After days, the customer’s overdue and unprocessed pending orders will automatically confirm the receipt.</span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>

                    <FormItem label="Completed orders are allowed to apply for refunds">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentOnlineForm.orderRefundsStatus}
                            onChange={(value) =>
                              this.paymentOnlineFormChange({
                                field: 'orderRefundsStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentOnlineForm.orderRefundsStatus ? (
                          <Col span={20}>
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
                              <span style={{ marginLeft: 10 }}>Within days, customers are allowed to initiate a return and refund application, and orders that have not been shipped can be returned at any time.</span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>

                    <FormItem label="Automatic review of pending return orders">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentOnlineForm.orderAutomaticReviewStatus}
                            onChange={(value) =>
                              this.paymentOnlineFormChange({
                                field: 'orderAutomaticReviewStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentOnlineForm.orderAutomaticReviewStatus ? (
                          <Col span={20}>
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={1}
                                max={9999}
                                value={paymentOnlineForm.orderAutomaticReviewValue}
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderAutomaticReviewValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>After days, the merchant’s overdue and pending refund orders will be automatically approved.</span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>

                    <FormItem label="Automatic confirmation of receipt of return order">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentOnlineForm.orderAutomaticConfirmationStatus}
                            onChange={(value) =>
                              this.paymentOnlineFormChange({
                                field: 'orderAutomaticConfirmationStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentOnlineForm.orderAutomaticConfirmationStatus ? (
                          <Col span={20}>
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={1}
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
                                After days, the merchant will automatically confirm the receipt of the pending return order that is not processed by the merchant overdue. The return order returned by the non-express will start to count after the review is passed.
                              </span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>
                  </>
                ) : null}
                {paymentCategory === 'Cash' ? (
                  <>
                    <FormItem label="Order expiration time">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentCashForm.orderExpirationTimeStatus}
                            onChange={(value) =>
                              this.paymentCashFormChange({
                                field: 'orderExpirationTimeStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentCashForm.orderExpirationTimeStatus ? (
                          <Col span={20}>
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
                              <span style={{ marginLeft: 10 }}>After hours, if the customer fails to pay overdue, the order will be automatically voided.</span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>

                    <FormItem label="Automatically confirm receipt of order">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentCashForm.orderConfirmReceiptStatus}
                            onChange={(value) =>
                              this.paymentCashFormChange({
                                field: 'orderConfirmReceiptStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentCashForm.orderConfirmReceiptStatus ? (
                          <Col span={20}>
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
                              <span style={{ marginLeft: 10 }}>After days, the customer’s overdue and unprocessed pending orders will automatically confirm the receipt.</span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>

                    <FormItem label="Completed orders are allowed to apply for refunds">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentCashForm.orderRefundsStatus}
                            onChange={(value) =>
                              this.paymentCashFormChange({
                                field: 'orderRefundsStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentCashForm.orderRefundsStatus ? (
                          <Col span={20}>
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
                              <span style={{ marginLeft: 10 }}>Within days, customers are allowed to initiate a return and refund application, and orders that have not been shipped can be returned at any time.</span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>

                    <FormItem label="Automatic review of pending return orders">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentCashForm.orderAutomaticReviewStatus}
                            onChange={(value) =>
                              this.paymentCashFormChange({
                                field: 'orderAutomaticReviewStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentCashForm.orderAutomaticReviewStatus ? (
                          <Col span={20}>
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={1}
                                max={9999}
                                value={paymentCashForm.orderAutomaticReviewValue}
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderAutomaticReviewValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>After days, the merchant’s overdue and pending refund orders will be automatically approved.</span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>

                    <FormItem label="Automatic confirmation of receipt of return order">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={paymentCashForm.orderAutomaticConfirmationStatus}
                            onChange={(value) =>
                              this.paymentCashFormChange({
                                field: 'orderAutomaticConfirmationStatus',
                                value: value
                              })
                            }
                          />
                        </Col>
                        {paymentCashForm.orderAutomaticConfirmationStatus ? (
                          <Col span={20}>
                            <div style={styles.inputStyle}>
                              <InputNumber
                                precision={0}
                                min={1}
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
                                After days, the merchant will automatically confirm the receipt of the pending return order that is not processed by the merchant overdue. The return order returned by the non-express will start to count after the review is passed.
                              </span>
                            </div>
                          </Col>
                        ) : null}
                      </Row>
                    </FormItem>
                  </>
                ) : null}
              </Form>
            </TabPane>
            <TabPane tab="Unlimited" key="Unlimited">
              <Form style={{ marginTop: 20 }} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="right">
                <FormItem label="Order expiration time">
                  <Row>
                    <Col span={1}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={unlimitedForm.orderExpirationTimeStatus}
                        onChange={(value) =>
                          this.unlimitedFormChange({
                            field: 'orderExpirationTimeStatus',
                            value: value
                          })
                        }
                      />
                    </Col>
                    {unlimitedForm.orderExpirationTimeStatus ? (
                      <Col span={20}>
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
                          <span style={{ marginLeft: 10 }}>After hours, if the customer fails to pay overdue, the order will be automatically voided.</span>
                        </div>
                      </Col>
                    ) : null}
                  </Row>
                </FormItem>

                <FormItem label="Automatically confirm receipt of order">
                  <Row>
                    <Col span={1}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={unlimitedForm.orderConfirmReceiptStatus}
                        onChange={(value) =>
                          this.unlimitedFormChange({
                            field: 'orderConfirmReceiptStatus',
                            value: value
                          })
                        }
                      />
                    </Col>
                    {unlimitedForm.orderConfirmReceiptStatus ? (
                      <Col span={20}>
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
                          <span style={{ marginLeft: 10 }}>After days, the customer’s overdue and unprocessed pending orders will automatically confirm the receipt.</span>
                        </div>
                      </Col>
                    ) : null}
                  </Row>
                </FormItem>

                <FormItem label="Completed orders are allowed to apply for refunds">
                  <Row>
                    <Col span={1}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={unlimitedForm.orderRefundsStatus}
                        onChange={(value) =>
                          this.unlimitedFormChange({
                            field: 'orderRefundsStatus',
                            value: value
                          })
                        }
                      />
                    </Col>
                    {unlimitedForm.orderRefundsStatus ? (
                      <Col span={20}>
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
                          <span style={{ marginLeft: 10 }}>Within days, customers are allowed to initiate a return and refund application, and orders that have not been shipped can be returned at any time.</span>
                        </div>
                      </Col>
                    ) : null}
                  </Row>
                </FormItem>

                <FormItem label="Automatic review of pending return orders">
                  <Row>
                    <Col span={1}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={unlimitedForm.orderAutomaticReviewStatus}
                        onChange={(value) =>
                          this.unlimitedFormChange({
                            field: 'orderAutomaticReviewStatus',
                            value: value
                          })
                        }
                      />
                    </Col>
                    {unlimitedForm.orderAutomaticReviewStatus ? (
                      <Col span={20}>
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={0}
                            min={1}
                            max={9999}
                            value={unlimitedForm.orderAutomaticReviewValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderAutomaticReviewValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}>After days, the merchant’s overdue and pending refund orders will be automatically approved.</span>
                        </div>
                      </Col>
                    ) : null}
                  </Row>
                </FormItem>

                <FormItem label="Automatic confirmation of receipt of return order">
                  <Row>
                    <Col span={1}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={unlimitedForm.orderAutomaticConfirmationStatus}
                        onChange={(value) =>
                          this.unlimitedFormChange({
                            field: 'orderAutomaticConfirmationStatus',
                            value: value
                          })
                        }
                      />
                    </Col>
                    {unlimitedForm.orderAutomaticConfirmationStatus ? (
                      <Col span={20}>
                        <div style={styles.inputStyle}>
                          <InputNumber
                            precision={0}
                            min={1}
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
                            After days, the merchant will automatically confirm the receipt of the pending return order that is not processed by the merchant overdue. The return order returned by the non-express will start to count after the review is passed.
                          </span>
                        </div>
                      </Col>
                    ) : null}
                  </Row>
                </FormItem>
              </Form>
            </TabPane>
          </Tabs>
        </div>
        <div className="bar-button">
          <Button type="primary" shape="round" style={{ marginRight: 10 }} onClick={() => this.updateOrderSettingConfig()}>
            {<FormattedMessage id="save" />}
          </Button>
        </div>
      </div>
    );
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

export default Form.create()(OrderSetting);
