import React, { Component } from 'react';
import styled from 'styled-components';
import { Relax, IMap } from 'plume2';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button, message, Input } from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from './../webapi';

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
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

class PaymentForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      paymentForm: {}
    };
    this.getPaymentSetting();
  }

  getPaymentSetting = async () => {
    const { res } = await webapi.getPaymentSetting();
    if (res.code === 'K-000000') {
      this.setState({
        paymentForm: res.context
      });
    } else {
      message.error(res.message);
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.paymentForm;
    data[field] = value;
    this.setState({
      paymentForm: data
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="environment" />}
              >
                {getFieldDecorator('environment', {
                  initialValue: this.state.paymentForm.environment,
                  rules: [{ required: false, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'environment',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="URL" />}
              >
                {getFieldDecorator('url', {
                  initialValue: this.state.paymentForm.url,
                  rules: [{ required: false, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'url',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
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
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="apiVersion" />}
              >
                {getFieldDecorator('apiVersion', {
                  initialValue: this.state.paymentForm.apiVersion,
                  rules: [
                    { required: false, message: 'Please input Api Version!' }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'apiVersion',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
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
            <Col span={12}>
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
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={this._next}>
                  <FormattedMessage id="save" />
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
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

  onSave = async () => {
    const paymentForm = this.state.paymentForm;
    const { res } = await webapi.savePaymentSetting({
      ...paymentForm
    });
    if (res.code === 'K-000000') {
      message.success('save successful');
    } else {
      message.error(res.message || 'save faild');
    }
  };
}
export default Form.create()(PaymentForm);
