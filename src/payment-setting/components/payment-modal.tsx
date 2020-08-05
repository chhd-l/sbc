import React, { Component } from 'react';
import styled from 'styled-components';
import { Relax, IMap } from 'plume2';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Form,
  Button,
  message,
  Input,
  Modal,
  Switch,
  Select
} from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup } from 'qmkit';

const formItemLayout = {
  labelCol: {
    span: 8
    // xs: { span: 24 },
    // sm: { span: 6 }
  },
  wrapperCol: {
    span: 16
    // xs: { span: 24 },
    // sm: { span: 14 }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

class PaymentModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      paymentForm: {}
    };
  }
  componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
    if (nextProps.paymentForm) {
      this.setState({
        paymentForm: nextProps.paymentForm
      });
    }
  }

  onFormChange = ({ field, value }) => {
    let data = this.state.paymentForm;
    // if(value.length > 0) {
    //   value.forEach((item) => {
    //     if(!item) {
    //       value = ["Maestro", "ChinaUnionPay", "Discover", "JCB", "OXXO", "AmericanExpress", "MasterCard", "VISA"]
    //     }
    //   })
    // }
    data[field] = value;
    this.setState(
      {
        paymentForm: data
      },
      () => {
        const data = this.state.paymentForm;
      }
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        maskClosable={false}
        title="Edit Payment Setting"
        visible={this.props.visible}
        onOk={this._next}
        onCancel={() => this.cancel()}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="appID" />}
              >
                {getFieldDecorator('appId', {
                  initialValue: this.state.paymentForm.appId,
                  rules: [{ required: false, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'appId',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="privateKey" />}
              >
                {getFieldDecorator('privateKey', {
                  initialValue: this.state.paymentForm.privateKey,
                  rules: [
                    { required: false, message: 'Please input Private Key!' }
                  ]
                })(
                  <Input.TextArea
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'privateKey',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="publicKey" />}
              >
                {getFieldDecorator('publicKey', {
                  initialValue: this.state.paymentForm.publicKey,
                  rules: [
                    { required: false, message: 'Please input Public Key!' }
                  ]
                })(
                  <Input.TextArea
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'publicKey',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>

            {/*新增*/}
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="paymentMethod" />}
              >
                {getFieldDecorator('paymentMethod', {
                  // initialValue: this.state.paymentForm.paymentMethod,
                  rules: [
                    {
                      required: false,
                      message: 'Please select Payment Method.'
                    }
                  ]
                })(
                  <Select
                    defaultValue=""
                    mode="multiple"
                    value={this.state.paymentForm.paymentMethod}
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'paymentMethod',
                        value: e
                      })
                    }
                  >
                    <Option value="">All</Option>
                    <Option value="VISA">
                      <img
                        src={require('../img/visa.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      VISA
                    </Option>
                    <Option value="MasterCard">
                      <img
                        src={require('../img/masterCard.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      MasterCard
                    </Option>
                    <Option value="AmericanExpress">
                      <img
                        src={require('../img/american.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      American Express
                    </Option>
                    <Option value="OXXO">
                      <img
                        src={require('../img/oxxo.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      OXXO
                    </Option>
                    <Option value="AmericanExpress">
                      <img
                        src={require('../img/Klarna_Logo.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      Klarna
                    </Option>
                    <Option value="JCB">
                      <img
                        src={require('../img/jcb.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      JCB
                    </Option>
                    <Option value="Discover">
                      <img
                        src={require('../img/discover.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      Discover
                    </Option>
                    <Option value="ChinaUnionPay">
                      <img
                        src={require('../img/chinaUnionPay.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      China Union Pay
                    </Option>
                    <Option value="Maestro">
                      <img
                        src={require('../img/maestro.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      Maestro
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="enabled" />}
              >
                {getFieldDecorator('enabled', {
                  initialValue: this.state.paymentForm.enabled
                })(
                  <Switch
                    defaultChecked
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'enabled',
                        value: e
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
  /**
   * 保存
   */
  _next = () => {
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.onSave();
      }
    });
  };

  cancel = () => {
    this.props.parent.closeModel();
  };

  onSave = async () => {
    const paymentForm = this.state.paymentForm;
    const { res } = await webapi.savePaymentSetting({
      ...paymentForm
    });
    if (res.code === 'K-000000') {
      message.success('save successful');
      this.props.setEnabled(paymentForm.enabled);
      this.cancel();
    } else {
      message.error(res.message || 'save faild');
    }
  };
}
export default Form.create()(PaymentModal);
