import React, { Component } from 'react';
import { Row, Col, Form, Button, message, Input, Modal, Switch, Select } from 'antd';
import * as webapi from '../webapi';
import { FormattedMessage } from 'react-intl';
import { QMMethod, ValidConst } from 'qmkit';
const FormItem = Form.Item;
const Option = Select.Option;
import { fromJS, List } from 'immutable';

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
    this.state = {
      prescriberRoleId: ''
    };
    this.getPrescriberRole = this.getPrescriberRole.bind(this);
    this.getPrescriberRole();
  }

  getPrescriberRole = async () => {
    const { res: roleRes } = await webapi.getAllRoles();
    let prescriberRole = fromJS(roleRes).find((x) => x.get('roleName') === 'Prescriber');
    this.setState({
      prescriberRoleId: prescriberRole.get('roleInfoId')
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal maskClosable={false} title={this.props.userForm.id ? 'Edit User' : 'Add User'} visible={this.props.visible} onOk={this.onSave} onCancel={() => this.cancel()}>
        <Form>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="firstName" />} hasFeedback>
                {getFieldDecorator('firstName', {
                  initialValue: this.props.userForm.firstName,
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message: 'Please input first name'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorWhiteSpace(rule, value, callback, 'firstName');
                      }
                    }
                  ]
                })(<Input placeholder="Only 1-20 characters" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="lastName" />} hasFeedback>
                {getFieldDecorator('lastName', {
                  initialValue: this.props.userForm.lastName,
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message: 'Please input last name'
                    },
                    {
                      min: 1,
                      max: 20,
                      message: '1-20 characters'
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorWhiteSpace(rule, value, callback, 'lastName');
                      }
                    }
                  ]
                })(<Input placeholder="Only 1-20 characters" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="email" />} required={true} hasFeedback>
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
                        QMMethod.validatorMinAndMax(rule, value, callback, 'Email', 0, 50);
                      }
                    }
                  ]
                })(<Input disabled={this.props.userForm.id} placeholder="0-50 characters" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }

  cancel = () => {
    this.props.parent.closeUserModel();
    this.props.form.resetFields();
  };

  onSave = async () => {
    this.props.form.validateFields(null, async (errs, values) => {
      //如果校验通过
      if (!errs) {
        let param = Object.assign({
          employeeId: this.props.userForm.id,
          employeeName: values.firstName + ' ' + values.lastName,
          email: values.email,
          prescriberIds: [this.props.prescriberKeyId],
          roleIdList: [this.state.prescriberRoleId.toString()],
          accountState: 3
        });
        if (this.props.userForm.id) {
          const { res } = await webapi.updateUser(param);
          if (res.code === 'K-000000') {
            message.success('Operate successfully');
            this.props.reflash();
            this.cancel();
          } else {
            message.error(res.message || 'save faild');
          }
        } else {
          const { res } = await webapi.addUser(param);
          if (res.code === 'K-000000') {
            message.success('Operate successfully');
            this.props.reflash();
            this.cancel();
          } else {
            message.error(res.message || 'save faild');
          }
        }
      }
    });
  };
}

export default Form.create()(UserModal);
