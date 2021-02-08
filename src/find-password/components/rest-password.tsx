import React, { Component } from 'react';
import { ValidConst, history, util, Const } from 'qmkit';
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
        <FormItem {...formItemLayout} label={<FormattedMessage id="oldPassword" />} hasFeedback required={true}>
          {getFieldDecorator('oldEncodePwd', {
            rules: [
              { required: true, message: 'Please enter the old password' },
              {
                pattern: ValidConst.password,
                message: 'Password is 6-16 alphanumeric password'
              }
            ]
          })(<Input type="password" />)}
        </FormItem>

        <FormItem {...formItemLayout} label={<FormattedMessage id="newPassword" />} hasFeedback required={true}>
          {getFieldDecorator('newEncodePwd', {
            rules: [
              { required: true, message: 'Please enter the new password' },
              {
                pattern: ValidConst.password,
                message: 'Password is 6-16 alphanumeric password'
              }
            ]
          })(<Input type="password" />)}
        </FormItem>

        <FormItem {...formItemLayout} label={<FormattedMessage id="confirmPassword" />} hasFeedback required={true}>
          {getFieldDecorator('accountPasswordConfirm', {
            rules: [
              {
                required: true,
                message: 'Please enter the confirmation password'
              },
              { validator: this.checkConfirmPassword }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <Row>
          <Col span={14}>&nbsp;</Col>
          <Col span={3} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.resetPassword}>
              <FormattedMessage id="save" />
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
      callback(new Error('Repeated passwords are inconsistent'));
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
      values.accountPasswordConfirm = base64.urlEncode(values.accountPasswordConfirm);
      values.oldEncodePwd = base64.urlEncode(values.oldEncodePwd);
    }
    const data = { employeeId: employeeId, ...values };
    const { res } = await updatePassword({
      ...data
    });
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
      setTimeout(() => history.push('/'), 1000);
    }
  };
}
export default Form.create()(RestPassword);
