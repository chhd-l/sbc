import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import {
  Icon,
  Table,
  Tooltip,
  Divider,
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb,
  Tag,
  message,
  Select,
  Radio,
  DatePicker,
  Spin,
  Alert,
  InputNumber
} from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

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
        orderConfirmReceiptStatus: true,
        orderConfirmReceiptValue: 1,
        orderRefundsStatus: true,
        orderRefundsValue: 1,
        orderAutomaticReviewStatus: true,
        orderAutomaticReviewValue: 1,
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 1
      },
      paymentCashForm: {
        orderExpirationTimeStatus: false,
        orderExpirationTimeValue: 2,
        orderConfirmReceiptStatus: true,
        orderConfirmReceiptValue: 2,
        orderRefundsStatus: true,
        orderRefundsValue: 2,
        orderAutomaticReviewStatus: true,
        orderAutomaticReviewValue: 2,
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 1
      },
      unlimitedOnlineForm: {
        orderExpirationTimeStatus: false,
        orderExpirationTimeValue: 3,
        orderConfirmReceiptStatus: true,
        orderConfirmReceiptValue: 3,
        orderRefundsStatus: true,
        orderRefundsValue: 3,
        orderAutomaticReviewStatus: true,
        orderAutomaticReviewValue: 3,
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 3
      },
      unlimitedCashForm: {
        orderExpirationTimeStatus: false,
        orderExpirationTimeValue: 4,
        orderConfirmReceiptStatus: true,
        orderConfirmReceiptValue: 4,
        orderRefundsStatus: true,
        orderRefundsValue: 4,
        orderAutomaticReviewStatus: true,
        orderAutomaticReviewValue: 4,
        orderAutomaticConfirmationStatus: false,
        orderAutomaticConfirmationValue: 4
      }
    };
  }
  componentDidMount() { }

  handleSequenceChange = (e) => {
    console.log(e.target.value);
    this.setState({
      paymentSequence: e.target.value
    });
  };
  handleCategoryChange = (e) => {
    console.log(e.target.value);
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
  unlimitedCashFormChange = ({ field, value }) => {
    if (!value && value !== false) {
      value = 1;
    }
    let data = this.state.unlimitedCashForm;
    data[field] = value;
    this.setState({
      unlimitedCashForm: data
    });
  };
  save = () => {
    let data = this.state.paymentOnlineForm;
    console.log(data);

    console.log('save');
  };

  render() {
    const {
      title,
      message,
      paymentOnlineForm,
      paymentCashForm,
      unlimitedOnlineForm,
      unlimitedCashForm,
      paymentSequence,
      paymentCategory
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const description = (
      <div>
        <p>
          1. Order settings are associated with the key process of order return
          processing, please operate with caution, all settings will take effect
          after clicking Save.
        </p>
        <p>
          2. If the customer has overdue and unprocessed orders to be received,
          the receipt will be automatically confirmed.
        </p>
        <p>
          3. If the completed order exceeds the set time, the customer will not
          be able to initiate a return or refund application.
        </p>
        <p>
          4. The pending refund orders that have not been processed by the
          merchant will be automatically approved.
        </p>
        <p>
          5. The merchant will automatically confirm the receipt of the pending
          return orders that have not been processed by the merchant.
        </p>
      </div>
    );

    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Alert message={message} description={description} type="warning" />
          <Form
            style={{ marginTop: 20 }}
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="right"
          >
            <FormItem label="Order payment sequence">
              <div>
                <Radio.Group
                  onChange={this.handleSequenceChange}
                  value={paymentSequence}
                >
                  <Radio.Button value="Payment before delivery">
                    Payment before delivery
                  </Radio.Button>
                  <Radio.Button value="Unlimited">Unlimited</Radio.Button>
                </Radio.Group>
                <p style={{ fontSize: 12, lineHeight: 1 }}>
                  Select "Payment before delivery", the customer must pay for
                  the order before the merchant can ship, select "Unlimited",
                  regardless of whether the customer pays or not
                </p>
              </div>
            </FormItem>

            <FormItem label="Payment category">
              <div>
                <Radio.Group
                  onChange={this.handleCategoryChange}
                  value={paymentCategory}
                >
                  <Radio.Button value="Online payment">
                    Online payment
                  </Radio.Button>
                  <Radio.Button value="Cash">Cash</Radio.Button>
                </Radio.Group>
              </div>
            </FormItem>
            {
              paymentSequence === 'Payment before delivery' && paymentCategory === 'Online payment' ?
                <>
                  <FormItem label="Order expiration time">
                    <Row>
                      <Col span={1}>
                        <Switch
                          checkedChildren="On"
                          unCheckedChildren="Off"
                          defaultChecked={paymentOnlineForm.orderExpirationTimeStatus}
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
                              min={1}
                              max={9999}
                              value={paymentOnlineForm.orderExpirationTimeValue}
                              onChange={(value) =>
                                this.paymentOnlineFormChange({
                                  field: 'orderExpirationTimeValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              After hours, if the customer fails to pay overdue, the
                              order will be automatically voided.
                      </span>
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
                          defaultChecked={paymentOnlineForm.orderConfirmReceiptStatus}
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
                            <span style={{ marginLeft: 10 }}>
                              After days, the customer’s overdue and unprocessed
                              pending orders will automatically confirm the receipt.
                      </span>
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
                          defaultChecked={paymentOnlineForm.orderRefundsStatus}
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
                            <span style={{ marginLeft: 10 }}>
                              Within days, customers are allowed to initiate a return
                              and refund application, and orders that have not been
                              shipped can be returned at any time.
                      </span>
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
                          defaultChecked={paymentOnlineForm.orderAutomaticReviewStatus}
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
                            <span style={{ marginLeft: 10 }}>
                              After days, the merchant’s overdue and pending refund
                              orders will be automatically approved.
                      </span>
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
                          defaultChecked={paymentOnlineForm.orderAutomaticConfirmationStatus}
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
                        After days, the merchant will automatically confirm the
                        receipt of the pending return order that is not
                        processed by the merchant overdue. The return order
                        returned by the non-express will start to count after
                        the review is passed.
                      </span>
                          </div>
                        </Col>
                      ) : null}
                    </Row>
                  </FormItem>

                </> : null
            }
            {
              paymentSequence === 'Payment before delivery' && paymentCategory === 'Cash' ?
                <>
                  <FormItem label="Order expiration time">
                    <Row>
                      <Col span={1}>
                        <Switch
                          checkedChildren="On"
                          unCheckedChildren="Off"
                          defaultChecked={paymentCashForm.orderExpirationTimeStatus}
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
                              min={1}
                              max={9999}
                              value={paymentCashForm.orderExpirationTimeValue}
                              onChange={(value) =>
                                this.paymentCashFormChange({
                                  field: 'orderExpirationTimeValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              After hours, if the customer fails to pay overdue, the
                              order will be automatically voided.
                      </span>
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
                          defaultChecked={paymentCashForm.orderConfirmReceiptStatus}
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
                            <span style={{ marginLeft: 10 }}>
                              After days, the customer’s overdue and unprocessed
                              pending orders will automatically confirm the receipt.
                      </span>
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
                          defaultChecked={paymentCashForm.orderRefundsStatus}
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
                            <span style={{ marginLeft: 10 }}>
                              Within days, customers are allowed to initiate a return
                              and refund application, and orders that have not been
                              shipped can be returned at any time.
                      </span>
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
                          defaultChecked={paymentCashForm.orderAutomaticReviewStatus}
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
                            <span style={{ marginLeft: 10 }}>
                              After days, the merchant’s overdue and pending refund
                              orders will be automatically approved.
                      </span>
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
                          defaultChecked={paymentCashForm.orderAutomaticConfirmationStatus}
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
                        After days, the merchant will automatically confirm the
                        receipt of the pending return order that is not
                        processed by the merchant overdue. The return order
                        returned by the non-express will start to count after
                        the review is passed.
                      </span>
                          </div>
                        </Col>
                      ) : null}
                    </Row>
                  </FormItem>

                </> : null
            }
            {
              paymentSequence === 'Unlimited' && paymentCategory === 'Online payment' ?
                <>
                  <FormItem label="Order expiration time">
                    <Row>
                      <Col span={1}>
                        <Switch
                          checkedChildren="On"
                          unCheckedChildren="Off"
                          defaultChecked={unlimitedOnlineForm.orderExpirationTimeStatus}
                          onChange={(value) =>
                            this.unlimitedOnlineFormChange({
                              field: 'orderExpirationTimeStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedOnlineForm.orderExpirationTimeStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedOnlineForm.orderExpirationTimeValue}
                              onChange={(value) =>
                                this.unlimitedOnlineFormChange({
                                  field: 'orderExpirationTimeValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              After hours, if the customer fails to pay overdue, the
                              order will be automatically voided.
                      </span>
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
                          defaultChecked={unlimitedOnlineForm.orderConfirmReceiptStatus}
                          onChange={(value) =>
                            this.unlimitedOnlineFormChange({
                              field: 'orderConfirmReceiptStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedOnlineForm.orderConfirmReceiptStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedOnlineForm.orderConfirmReceiptValue}
                              onChange={(value) =>
                                this.unlimitedOnlineFormChange({
                                  field: 'orderConfirmReceiptValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              After days, the customer’s overdue and unprocessed
                              pending orders will automatically confirm the receipt.
                      </span>
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
                          defaultChecked={unlimitedOnlineForm.orderRefundsStatus}
                          onChange={(value) =>
                            this.unlimitedOnlineFormChange({
                              field: 'orderRefundsStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedOnlineForm.orderRefundsStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedOnlineForm.orderRefundsValue}
                              onChange={(value) =>
                                this.unlimitedOnlineFormChange({
                                  field: 'orderRefundsValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              Within days, customers are allowed to initiate a return
                              and refund application, and orders that have not been
                              shipped can be returned at any time.
                      </span>
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
                          defaultChecked={unlimitedOnlineForm.orderAutomaticReviewStatus}
                          onChange={(value) =>
                            this.unlimitedOnlineFormChange({
                              field: 'orderAutomaticReviewStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedOnlineForm.orderAutomaticReviewStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedOnlineForm.orderAutomaticReviewValue}
                              onChange={(value) =>
                                this.unlimitedOnlineFormChange({
                                  field: 'orderAutomaticReviewValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              After days, the merchant’s overdue and pending refund
                              orders will be automatically approved.
                      </span>
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
                          defaultChecked={unlimitedOnlineForm.orderAutomaticConfirmationStatus}
                          onChange={(value) =>
                            this.unlimitedOnlineFormChange({
                              field: 'orderAutomaticConfirmationStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedOnlineForm.orderAutomaticConfirmationStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedOnlineForm.orderAutomaticConfirmationValue}
                              onChange={(value) =>
                                this.unlimitedOnlineFormChange({
                                  field: 'orderAutomaticConfirmationValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              {' '}
                        After days, the merchant will automatically confirm the
                        receipt of the pending return order that is not
                        processed by the merchant overdue. The return order
                        returned by the non-express will start to count after
                        the review is passed.
                      </span>
                          </div>
                        </Col>
                      ) : null}
                    </Row>
                  </FormItem>

                </> : null
            }
            {
              paymentSequence === 'Unlimited' && paymentCategory === 'Cash' ?
                <>
                  <FormItem label="Order expiration time">
                    <Row>
                      <Col span={1}>
                        <Switch
                          checkedChildren="On"
                          unCheckedChildren="Off"
                          defaultChecked={unlimitedCashForm.orderExpirationTimeStatus}
                          onChange={(value) =>
                            this.unlimitedCashFormChange({
                              field: 'orderExpirationTimeStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedCashForm.orderExpirationTimeStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedCashForm.orderExpirationTimeValue}
                              onChange={(value) =>
                                this.unlimitedCashFormChange({
                                  field: 'orderExpirationTimeValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              After hours, if the customer fails to pay overdue, the
                              order will be automatically voided.
                      </span>
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
                          defaultChecked={unlimitedCashForm.orderConfirmReceiptStatus}
                          onChange={(value) =>
                            this.unlimitedCashFormChange({
                              field: 'orderConfirmReceiptStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedCashForm.orderConfirmReceiptStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedCashForm.orderConfirmReceiptValue}
                              onChange={(value) =>
                                this.unlimitedCashFormChange({
                                  field: 'orderConfirmReceiptValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              After days, the customer’s overdue and unprocessed
                              pending orders will automatically confirm the receipt.
                      </span>
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
                          defaultChecked={unlimitedCashForm.orderRefundsStatus}
                          onChange={(value) =>
                            this.unlimitedCashFormChange({
                              field: 'orderRefundsStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedCashForm.orderRefundsStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedCashForm.orderRefundsValue}
                              onChange={(value) =>
                                this.unlimitedCashFormChange({
                                  field: 'orderRefundsValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              Within days, customers are allowed to initiate a return
                              and refund application, and orders that have not been
                              shipped can be returned at any time.
                      </span>
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
                          defaultChecked={unlimitedCashForm.orderAutomaticReviewStatus}
                          onChange={(value) =>
                            this.unlimitedCashFormChange({
                              field: 'orderAutomaticReviewStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedCashForm.orderAutomaticReviewStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedCashForm.orderAutomaticReviewValue}
                              onChange={(value) =>
                                this.unlimitedCashFormChange({
                                  field: 'orderAutomaticReviewValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              After days, the merchant’s overdue and pending refund
                              orders will be automatically approved.
                      </span>
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
                          defaultChecked={unlimitedCashForm.orderAutomaticConfirmationStatus}
                          onChange={(value) =>
                            this.unlimitedCashFormChange({
                              field: 'orderAutomaticConfirmationStatus',
                              value: value
                            })
                          }
                        />
                      </Col>
                      {unlimitedCashForm.orderAutomaticConfirmationStatus ? (
                        <Col span={20}>
                          <div style={styles.inputStyle}>
                            <InputNumber
                              min={1}
                              max={9999}
                              value={unlimitedCashForm.orderAutomaticConfirmationValue}
                              onChange={(value) =>
                                this.unlimitedCashFormChange({
                                  field: 'orderAutomaticConfirmationValue',
                                  value: value
                                })
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              {' '}
                        After days, the merchant will automatically confirm the
                        receipt of the pending return order that is not
                        processed by the merchant overdue. The return order
                        returned by the non-express will start to count after
                        the review is passed.
                      </span>
                          </div>
                        </Col>
                      ) : null}
                    </Row>
                  </FormItem>

                </> : null
            }


          </Form>
        </div>
        <div className="bar-button">
          <Button
            type="primary"
            shape="round"
            style={{ marginRight: 10 }}
            onClick={() => this.save()}
          >
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
  }
} as any;

export default Form.create()(OrderSetting);
