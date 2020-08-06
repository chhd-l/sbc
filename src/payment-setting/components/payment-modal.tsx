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
      paymentForm: {},
      gatewayConfigSaveRequest: {},
      gatewayModifyRequest: {},
      paymentMethodAll: [
        'VISA',
        'Master Card',
        'American Express',
        'OXXO',
        'Klarna',
        'JCB',
        'Discover',
        'China Union Pay',
        'Maestro'
      ]
    };
  }
  componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
    if (nextProps.paymentForm) {
      let gatewayModifyRequest = {
        gatewayEnum: nextProps.paymentForm.name,
        id: nextProps.paymentForm.id,
        isOpen: nextProps.paymentForm.isOpen,
        type: nextProps.paymentForm.type
      };
      this.setState(
        {
          gatewayConfigSaveRequest: nextProps.paymentForm.config,
          gatewayModifyRequest: gatewayModifyRequest
        },
        () => {
          if (gatewayModifyRequest.id) {
            const { gatewayConfigSaveRequest } = this.state;
            this.props.form.setFields({
              appId: gatewayConfigSaveRequest.appId,
              privateKey: gatewayConfigSaveRequest.privateKey,
              publicKey: gatewayConfigSaveRequest.publicKey,
              enabled: gatewayModifyRequest.isOpen === '1' ? true : false
            });
          }
        }
      );
    }
  }

  onFormChange = ({ field, value }) => {
    const { gatewayConfigSaveRequest } = this.state;
    // if(value.length > 0) {
    //   value.forEach((item) => {
    //     if(!item) {
    //       value = ["Maestro", "ChinaUnionPay", "Discover", "JCB", "OXXO", "AmericanExpress", "MasterCard", "VISA"]
    //     }
    //   })
    // }
    gatewayConfigSaveRequest[field] = value;
    this.setState({
      gatewayConfigSaveRequest: gatewayConfigSaveRequest
    });
  };
  onEnbleChange = (value) => {
    console.log(value);
  };
  onPaymentMethodChange = ({ value }) => {
    console.log(value);
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
                  initialValue:
                    this.state.paymentForm.config &&
                    this.state.paymentForm.config.privateKey,
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
                      this.onPaymentMethodChange({
                        value: e
                      })
                    }
                  >
                    <Option value="all">All</Option>
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
                    <Option value="Master Card">
                      <img
                        src={require('../img/masterCard.png')}
                        style={{
                          width: '30px',
                          height: '20px',
                          marginRight: '10px'
                        }}
                      />
                      Master Card
                    </Option>
                    <Option value="American Express">
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
                    <Option value="Klarna">
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
                    <Option value="China Union Pay">
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
                {getFieldDecorator(
                  'enabled',
                  {}
                )(
                  <Switch
                    onChange={(value: any) => this.onEnbleChange(value)}
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
