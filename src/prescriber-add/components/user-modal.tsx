import React, { Component } from 'react';
import { Row, Col, Form, Button, message, Input, Modal, Switch, Select } from 'antd';
import * as webapi from '../webapi';
import { FormattedMessage } from 'react-intl';
import { QMMethod, ValidConst, Const } from 'qmkit';
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
    const { res } = await webapi.getAllRoles();
    let prescriberRole = res.context.find((x) => x.roleName === (Const.SITE_NAME === 'MYVETRECO' ? 'Admin' : 'Prescriber'));
    this.setState({
      prescriberRoleId: prescriberRole.roleInfoId
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal maskClosable={false} title={this.props.userForm.id ? <FormattedMessage id="Prescriber.Edit"/> : <FormattedMessage id="Prescriber.Add"/>} visible={this.props.visible} onOk={this.onSave} onCancel={() => this.cancel()}>
        <Form>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="Prescriber.firstName" />} hasFeedback>
                {getFieldDecorator('firstName', {
                  initialValue: this.props.userForm.firstName,
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message: <FormattedMessage id="Prescriber.PleaseInputFirstName" />
                    },
                    {
                      min: 1,
                      max: 20,
                      message: <FormattedMessage id="Prescriber.characters" />
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
              <FormItem {...formItemLayout} label={<FormattedMessage id="Prescriber.lastName" />} hasFeedback>
                {getFieldDecorator('lastName', {
                  initialValue: this.props.userForm.lastName,
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message: <FormattedMessage id="Prescriber.PleaseInputLastName" />
                    },
                    {
                      min: 1,
                      max: 20,
                      message: <FormattedMessage id="Prescriber.characters" />
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
              <FormItem {...formItemLayout} label={<FormattedMessage id="Prescriber.email" />} required={true} hasFeedback>
                {getFieldDecorator('email', {
                  initialValue: this.props.userForm.email,
                  rules: [
                    { required: true, message: <FormattedMessage id="Prescriber.PleaseInputEmail" /> },
                    {
                      pattern: ValidConst.email,
                      message: <FormattedMessage id="Prescriber.PleaseEnterYourVaildEmail" />
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
      //??????????????????
      if (!errs) {
        let param = Object.assign({
          employeeId: this.props.userForm.id,
          employeeName: values.firstName + ' ' + values.lastName,
          email: values.email,
          prescriberIds: [this.props.prescriberKeyId],
          roleIdList: [this.state.prescriberRoleId.toString()],
          accountState: Const.SITE_NAME === 'MYVETRECO' ? 0 : 3
        });
        if (this.props.userForm.id) {
          const { res } = await webapi.updateUser(param);
          if (res.code === Const.SUCCESS_CODE) {
            message.success(<FormattedMessage id="Prescriber.OperateSuccessfully" />);
            this.props.reflash();
            this.cancel();
          } else {
            message.error(res.message || <FormattedMessage id="Prescriber.saveFaild" />);
          }
        } else {
          const { res } = await webapi.addUser(param);
          if (res.code === Const.SUCCESS_CODE) {
            message.success(<FormattedMessage id="Prescriber.OperateSuccessfully" />);
            this.props.reflash();
            this.cancel();
          } else {
            message.error(res.message || <FormattedMessage id="Prescriber.saveFaild" />);
          }
        }
      }
    });
  };
}

export default Form.create()(UserModal);
