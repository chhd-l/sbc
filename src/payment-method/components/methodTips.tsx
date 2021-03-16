import React, { Component } from 'react';
import { Row, Col, Form, Button, message, Input, Modal, Switch, Select } from 'antd';

import { FormattedMessage } from 'react-intl';

import * as webapi from '../webapi';
import { SelectGroup, Const } from 'qmkit';

class MethodTips extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      paymentForm: {
        enabled: false
      },
      enabled: null
    };
  }

  onFormChange = (value) => {
    this.setState({
      enabled: value
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let checked = this.state.paymentForm.enabled;
    if (this.state.enabled != null) {
      checked = this.state.enabled;
    }

    return <Modal maskClosable={false} title="Edit Payment Setting" visible={this.props.visible} onOk={this._next} onCancel={() => this.cancel()}></Modal>;
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
export default Form.create()(MethodTips);
