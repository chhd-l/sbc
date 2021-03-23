import React, { Component } from 'react';
import { Row, Col, Form, Tabs, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
const Option = Select.Option;
import * as webapi from '../webapi';
import { SelectGroup, Const } from 'qmkit';
import List from "@/groupon-activity-list/component/list";

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

class PaymentModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      paymentForm: {
        enabled: false
      },
      enabled: null
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.paymentForm.config) {
      let config = nextProps.paymentForm.config;
      this.setState({
        paymentForm: Object.assign({
          configId: config.id,
          modifyId: nextProps.paymentForm.id,
          gatewayId: config.payGateway.id,
          gatewayEnum: config.payGateway.name,
          apiKey: config.apiKey,
          appId: config.appId,
          privateKey: config.privateKey,
          publicKey: config.publicKey,
          paymentMethod: nextProps.paymentForm.storePaymentMethod ? nextProps.paymentForm.storePaymentMethod.split(',') : [],
          enabled: nextProps.paymentForm.isOpen === 1 ? true : false
        })
      });
    }
  }

  onFormChange = (value) => {
    this.setState({
      enabled: value
    });
  };

  _handleClick = (value) => {

  };

  render() {
    const { getFieldDecorator } = this.props.form;
    //const key = form.get('tabType');
    let checked = this.state.paymentForm.enabled;
    if (this.state.enabled != null) {
      checked = this.state.enabled;
    }

    return (
      <Modal maskClosable={false} title="Edit Payment Setting" visible={this.props.visible} onOk={this._next} onCancel={() => this.cancel()} okText="Submit">
        <Tabs  onChange={(key) => this._handleClick(key)}>
          <Tabs.TabPane tab="进行中">
            qqq
          </Tabs.TabPane>
          <Tabs.TabPane tab="即将开始">
            www
          </Tabs.TabPane>
          <Tabs.TabPane tab="已结束">
            eeee
          </Tabs.TabPane>
          <Tabs.TabPane tab="待审核">
            44
          </Tabs.TabPane>
          <Tabs.TabPane tab="审核失败">
            5
          </Tabs.TabPane>
        </Tabs>
        <Form>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} required={true} label={<FormattedMessage id="apiKey" />}>
                {getFieldDecorator('apiKey', {
                  initialValue: this.state.paymentForm.apiKey,
                  rules: [{ required: true, message: 'Please input Api Key!' }]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="appID" />}>
                {getFieldDecorator('appId', {
                  initialValue: this.state.paymentForm.appId,
                  rules: [{ required: false, message: 'Please input App ID!' }]
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="privateKey" />}>
                {getFieldDecorator('privateKey', {
                  initialValue: this.state.paymentForm.privateKey,
                  rules: [{ required: false, message: 'Please input Private Key!' }]
                })(<Input.TextArea />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="publicKey" />}>
                {getFieldDecorator('publicKey', {
                  initialValue: this.state.paymentForm.publicKey,
                  rules: [{ required: false, message: 'Please input Public Key!' }]
                })(<Input.TextArea />)}
              </FormItem>
            </Col>

            {/*新增*/}
            <Col span={24}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="paymentMethod" />}>
                {getFieldDecorator('paymentMethod', {
                  initialValue: this.state.paymentForm.paymentMethod,
                  rules: [
                    {
                      required: false,
                      message: 'Please select Payment Method.'
                    }
                  ]
                })(
                  <Select mode="multiple">
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
              <FormItem {...formItemLayout} label={<FormattedMessage id="enabled" />}>
                {getFieldDecorator('enabled', {
                  initialValue: this.state.paymentForm.enabled
                })(<Switch checked={checked} onChange={(value) => this.onFormChange(value)} />)}
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
    this.props.form.resetFields();
    this.setState({
      enabled: null
    });
  };

  onSave = async () => {
    this.props.form.validateFields(null, async (errs, values) => {
      //如果校验通过
      if (!errs) {
        const { res } = await webapi.savePaymentSetting({
          gatewayConfigSaveRequest: Object.assign({
            id: this.state.paymentForm.configId,
            gatewayId: this.state.paymentForm.gatewayId,
            apiKey: values.apiKey,
            appId: values.appId,
            privateKey: values.privateKey,
            publicKey: values.publicKey
          }),
          gatewayModifyRequest: Object.assign({
            gatewayEnum: this.state.paymentForm.gatewayEnum,
            id: this.state.paymentForm.modifyId,
            isOpen: values.enabled ? 1 : 0,
            storePaymentMethod: values.paymentMethod.join(','),
            type: true
          })
        });
        if (res.code === Const.SUCCESS_CODE) {
          message.success('Operate successfully');
          this.props.reflash();
          this.cancel();
        }
      }
    });
  };
}
export default Form.create()(PaymentModal);
