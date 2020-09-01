import React, { Component } from 'react';
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
import * as webapi from '../webapi';
import { FormattedMessage } from 'react-intl';
import { QMMethod, ValidConst } from 'qmkit';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};

class UserModal extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        maskClosable={false}
        title="Edit Prescriber User"
        visible={this.props.visible}
        onOk={this._next}
        onCancel={() => this.cancel()}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="firstName" />}
                hasFeedback
              >
                {getFieldDecorator('firstName', {
                  initialValue: this.props.userForm.firstName,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input first name'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    }
                  ]
                })(<Input placeholder="Only 1-20 characters" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="lastName" />}
                hasFeedback
              >
                {getFieldDecorator('lastName', {
                  initialValue: this.props.userForm.lastName,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: 'Please input last name'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    }
                  ]
                })(<Input placeholder="Only 1-20 characters" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="email" />}
                required={true}
                hasFeedback
              >
                {getFieldDecorator('email', {
                  initialValue: this.props.userForm.email,
                  rules: [
                    { required: true, message: 'Please input email' },
                    {
                      pattern: ValidConst.email,
                      message: 'Please enter your vaild email'
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          'Email',
                          0,
                          50
                        );
                      }
                    }
                  ]
                })(<Input placeholder="0-50 characters" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }

  _next = () => {
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.onSave();
      }
    });
  };

  cancel = () => {
    this.props.parent.closeUserModel();
    this.props.form.resetFields();
  };

  onSave = async () => {
    this.props.form.validateFields(null, async (errs, values) => {
      //如果校验通过
      if (!errs) {
        const { res } = await webapi.saveEmployee({});
        if (res.code === 'K-000000') {
          message.success('save successful');
          this.props.reflash();
          this.cancel();
        } else {
          message.error(res.message || 'save faild');
        }
      }
    });
  };
}

export default Form.create()(UserModal);
