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
      orderPaymentSequence: 'Payment before delivery',
      paymentCategory: 'Online payment',
      ruleForm: {
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
      }
    };
  }
  componentDidMount() {}

  handleSequenceChange = (e) => {
    console.log(e.target.value);
    this.setState({
      orderPaymentSequence: e.target.value
    });
  };
  handleCategoryChange = (e) => {
    console.log(e.target.value);
    this.setState({
      paymentCategory: e.target.value
    });
  };
  ruleFormChangge = ({ field, value }) => {
    if (!value && value !== false) {
      value = 1;
    }
    let data = this.state.ruleForm;
    data[field] = value;
    this.setState({
      ruleForm: data
    });
  };
  save = () => {
    let data = this.state.ruleForm;
    console.log(data);

    console.log('save');
  };

  render() {
    const {
      title,
      message,
      ruleForm,
      orderPaymentSequence,
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
                  value={orderPaymentSequence}
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

            <FormItem label="Order expiration time">
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    defaultChecked={ruleForm.orderExpirationTimeStatus}
                    onChange={(value) =>
                      this.ruleFormChangge({
                        field: 'orderExpirationTimeStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {ruleForm.orderExpirationTimeStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        min={1}
                        max={9999}
                        value={ruleForm.orderExpirationTimeValue}
                        onChange={(value) =>
                          this.ruleFormChangge({
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
                    defaultChecked={ruleForm.orderConfirmReceiptStatus}
                    onChange={(value) =>
                      this.ruleFormChangge({
                        field: 'orderConfirmReceiptStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {ruleForm.orderConfirmReceiptStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        min={1}
                        max={9999}
                        value={ruleForm.orderConfirmReceiptValue}
                        onChange={(value) =>
                          this.ruleFormChangge({
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
                    defaultChecked={ruleForm.orderRefundsStatus}
                    onChange={(value) =>
                      this.ruleFormChangge({
                        field: 'orderRefundsStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {ruleForm.orderRefundsStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        min={1}
                        max={9999}
                        value={ruleForm.orderRefundsValue}
                        onChange={(value) =>
                          this.ruleFormChangge({
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
                    defaultChecked={ruleForm.orderAutomaticReviewStatus}
                    onChange={(value) =>
                      this.ruleFormChangge({
                        field: 'orderAutomaticReviewStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {ruleForm.orderAutomaticReviewStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        min={1}
                        max={9999}
                        value={ruleForm.orderAutomaticReviewValue}
                        onChange={(value) =>
                          this.ruleFormChangge({
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
                    defaultChecked={ruleForm.orderAutomaticConfirmationStatus}
                    onChange={(value) =>
                      this.ruleFormChangge({
                        field: 'orderAutomaticConfirmationStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {ruleForm.orderAutomaticConfirmationStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        min={1}
                        max={9999}
                        value={ruleForm.orderAutomaticConfirmationValue}
                        onChange={(value) =>
                          this.ruleFormChangge({
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
