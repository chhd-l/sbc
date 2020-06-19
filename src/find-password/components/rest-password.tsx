import React, { Component } from 'react';
import { ValidConst, history, util } from 'qmkit';
import { Row, Form, Input, message, Col, Button } from 'antd';
import { updatePassword } from './../webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 10 }
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

class RestPassword extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="oldPassword" />}
          hasFeedback
          required={true}
        >
          {getFieldDecorator('oldEncodePwd', {
            rules: [
              { required: true, message: '请输入密码' },
              {
                pattern: ValidConst.password,
                message: '密码为6-16位字母或数字密码'
              }
            ]
          })(<Input type="password" />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="newPassword" />}
          hasFeedback
          required={true}
        >
          {getFieldDecorator('newEncodePwd', {
            rules: [
              { required: true, message: '请输入密码' },
              {
                pattern: ValidConst.password,
                message: '密码为6-16位字母或数字密码'
              }
            ]
          })(<Input type="password" />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="confirmPassword" />}
          hasFeedback
          required={true}
        >
          {getFieldDecorator('accountPasswordConfirm', {
            rules: [
              { required: true, message: '请输入确认密码' },
              { validator: this.checkConfirmPassword }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <Row>
          <Col span={14}>&nbsp;</Col>
          <Col span={3} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.resetPassword}>
              <FormattedMessage id="Savelogin" />
            </Button>
          </Col>
          <Col span={3} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => history.push('/')}>
              <FormattedMessage id="cancel" />
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  checkConfirmPassword = (_rule, value, callback) => {
    if (value != this.props.form.getFieldValue('newEncodePwd')) {
      callback(new Error('重复密码不一致'));
      return;
    }

    callback();
  };

  resetPassword = () => {
    const form = this.props.form;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        this.onSave(values);
      }
    });
  };

  onSave = async (values) => {
    const employeeId = sessionStorage.getItem('employeeId');
    let base64 = new util.Base64();
    if (values.newEncodePwd) {
      values.newEncodePwd = base64.urlEncode(values.newEncodePwd);
      values.accountPasswordConfirm = base64.urlEncode(
        values.accountPasswordConfirm
      );
      values.oldEncodePwd = base64.urlEncode(values.oldEncodePwd);
    }
    const data = { employeeId: employeeId, ...values };
    const { res } = await updatePassword({
      ...data
    });
    if (res.code === 'K-000000') {
      message.success('save successful');
      setTimeout(() => history.push('/login'), 1000);
    } else {
      message.error(res.message || 'save faild');
    }
  };
}
export default Form.create()(RestPassword);
