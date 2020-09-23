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
  InputNumber,
  Tabs
} from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

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
      unlimitedForm: {
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
  componentDidMount() {}

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
      unlimitedForm,
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

          <p style={styles.tipsStyle}>
            Select "Payment before delivery", the customer must pay for the
            order before the merchant can ship, select "Unlimited", regardless
            of whether the customer pays or not
          </p>
          <Tabs defaultActiveKey="Payment before delivery">
            <TabPane
              tab="Payment before delivery"
              key="Payment before delivery"
            >
              <Form
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="right"
              >
                <FormItem label="Payment category">
                  <div>
                    <Radio.Group
                      onChange={this.handleCategoryChange}
                      value={paymentCategory}
                    >
                      <Radio.Button
                        style={{ width: 140, textAlign: 'center' }}
                        value="Online payment"
                      >
                        Online payment
                      </Radio.Button>
                      <Radio.Button
                        style={{ width: 140, textAlign: 'center' }}
                        value="Cash"
                      >
                        Cash
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </FormItem>
                {paymentCategory === 'Online payment' ? (
                  <>
                    <FormItem label="Order expiration time">
                      <Row>
                        <Col span={1}>
                          <Switch
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            defaultChecked={
                              paymentOnlineForm.orderExpirationTimeStatus
                            }
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
                                value={
                                  paymentOnlineForm.orderExpirationTimeValue
                                }
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderExpirationTimeValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>
                                After hours, if the customer fails to pay
                                overdue, the order will be automatically voided.
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
                            defaultChecked={
                              paymentOnlineForm.orderConfirmReceiptStatus
                            }
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
                                value={
                                  paymentOnlineForm.orderConfirmReceiptValue
                                }
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderConfirmReceiptValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>
                                After days, the customer’s overdue and
                                unprocessed pending orders will automatically
                                confirm the receipt.
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
                            defaultChecked={
                              paymentOnlineForm.orderRefundsStatus
                            }
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
                                Within days, customers are allowed to initiate a
                                return and refund application, and orders that
                                have not been shipped can be returned at any
                                time.
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
                            defaultChecked={
                              paymentOnlineForm.orderAutomaticReviewStatus
                            }
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
                                value={
                                  paymentOnlineForm.orderAutomaticReviewValue
                                }
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderAutomaticReviewValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>
                                After days, the merchant’s overdue and pending
                                refund orders will be automatically approved.
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
                            defaultChecked={
                              paymentOnlineForm.orderAutomaticConfirmationStatus
                            }
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
                                value={
                                  paymentOnlineForm.orderAutomaticConfirmationValue
                                }
                                onChange={(value) =>
                                  this.paymentOnlineFormChange({
                                    field: 'orderAutomaticConfirmationValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>
                                {' '}
                                After days, the merchant will automatically
                                confirm the receipt of the pending return order
                                that is not processed by the merchant overdue.
                                The return order returned by the non-express
                                will start to count after the review is passed.
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
                            defaultChecked={
                              paymentCashForm.orderExpirationTimeStatus
                            }
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
                                After hours, if the customer fails to pay
                                overdue, the order will be automatically voided.
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
                            defaultChecked={
                              paymentCashForm.orderConfirmReceiptStatus
                            }
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
                                After days, the customer’s overdue and
                                unprocessed pending orders will automatically
                                confirm the receipt.
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
                                Within days, customers are allowed to initiate a
                                return and refund application, and orders that
                                have not been shipped can be returned at any
                                time.
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
                            defaultChecked={
                              paymentCashForm.orderAutomaticReviewStatus
                            }
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
                                value={
                                  paymentCashForm.orderAutomaticReviewValue
                                }
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderAutomaticReviewValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>
                                After days, the merchant’s overdue and pending
                                refund orders will be automatically approved.
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
                            defaultChecked={
                              paymentCashForm.orderAutomaticConfirmationStatus
                            }
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
                                value={
                                  paymentCashForm.orderAutomaticConfirmationValue
                                }
                                onChange={(value) =>
                                  this.paymentCashFormChange({
                                    field: 'orderAutomaticConfirmationValue',
                                    value: value
                                  })
                                }
                              />
                              <span style={{ marginLeft: 10 }}>
                                {' '}
                                After days, the merchant will automatically
                                confirm the receipt of the pending return order
                                that is not processed by the merchant overdue.
                                The return order returned by the non-express
                                will start to count after the review is passed.
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
              <Form
                style={{ marginTop: 20 }}
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="right"
              >
                <FormItem label="Order expiration time">
                  <Row>
                    <Col span={1}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        defaultChecked={unlimitedForm.orderExpirationTimeStatus}
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
                            min={1}
                            max={9999}
                            value={unlimitedForm.orderExpirationTimeValue}
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderExpirationTimeValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}>
                            After hours, if the customer fails to pay overdue,
                            the order will be automatically voided.
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
                        defaultChecked={unlimitedForm.orderConfirmReceiptStatus}
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
                          <span style={{ marginLeft: 10 }}>
                            After days, the customer’s overdue and unprocessed
                            pending orders will automatically confirm the
                            receipt.
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
                        defaultChecked={unlimitedForm.orderRefundsStatus}
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
                          <span style={{ marginLeft: 10 }}>
                            Within days, customers are allowed to initiate a
                            return and refund application, and orders that have
                            not been shipped can be returned at any time.
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
                        defaultChecked={
                          unlimitedForm.orderAutomaticReviewStatus
                        }
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
                          <span style={{ marginLeft: 10 }}>
                            After days, the merchant’s overdue and pending
                            refund orders will be automatically approved.
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
                        defaultChecked={
                          unlimitedForm.orderAutomaticConfirmationStatus
                        }
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
                            min={1}
                            max={9999}
                            value={
                              unlimitedForm.orderAutomaticConfirmationValue
                            }
                            onChange={(value) =>
                              this.unlimitedFormChange({
                                field: 'orderAutomaticConfirmationValue',
                                value: value
                              })
                            }
                          />
                          <span style={{ marginLeft: 10 }}>
                            {' '}
                            After days, the merchant will automatically confirm
                            the receipt of the pending return order that is not
                            processed by the merchant overdue. The return order
                            returned by the non-express will start to count
                            after the review is passed.
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
  },
  tipsStyle: {
    fontSize: 16,
    lineHeight: 1,
    margin: '20px 0 10px 0'
  }
} as any;

export default Form.create()(OrderSetting);
