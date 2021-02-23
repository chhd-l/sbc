import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, Modal } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
const fedEx = require('./img/FedEx.png');

const FormItem = Form.Item;

class ValidationSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: 'Validation setting',
      loading: false,
      isFGS: true,
      visibleApiSetting: false,
      addressSettingForm: {
        validationUrl: '',
        clientId: '',
        parentKey: '',
        companyCode: '',
        parentPassword: '',
        userKey: '',
        userPassword: '',
        accountNumber: '',
        meterNumber: '',
        clientReferenceId: ''
      }
    };
  }
  componentDidMount() {}
  init = () => {};

  openEditPage = () => {
    this.setState({
      visibleApiSetting: true
    });
  };

  handleCancel = () => {
    this.setState({
      visibleApiSetting: false
    });
  };
  handleSettingSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          visibleApiSetting: false
        });
      }
    });
  };
  onAddressSettingFormChange = ({ field, value }) => {
    let data = this.state.addressSettingForm;
    data[field] = value;
    this.setState({
      addressSettingForm: data
    });
  };

  render() {
    const { loading, title, isFGS, visibleApiSetting, addressSettingForm } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      }
    };
    const { getFieldDecorator } = this.props.form;

    return (
      <AuthWrapper functionName="f_validation_setting">
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container">
              <Headline title={title} />
              <div style={{ marginBottom: 10, display: 'flex' }}>
                <Card style={{ width: 300, marginRight: 50 }} bodyStyle={{ padding: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <img src={fedEx} style={{ height: '90px' }} />
                  </div>
                  <div className="bar" style={{ float: 'right' }}>
                    <Popconfirm
                      title={'Are you sure to ' + (!isFGS ? ' disable' : 'enable') + ' this?'}
                      onConfirm={() =>
                        this.setState({
                          isFGS: !isFGS
                        })
                      }
                      okText="Yes"
                      cancelText="No"
                    >
                      <Switch checked={!isFGS} size="small" />
                    </Popconfirm>
                    {!isFGS ? (
                      <Tooltip placement="top" title="Edit">
                        <a
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10
                          }}
                          className="iconfont iconEdit"
                          onClick={() => this.openEditPage()}
                        ></a>
                      </Tooltip>
                    ) : null}
                  </div>
                </Card>

                <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <i className="icon iconfont iconSetting" style={{ color: '#e2001a', fontSize: 60 }}></i>
                  </div>
                  <div className="bar" style={{ float: 'right' }}>
                    <Popconfirm
                      title={'Are you sure to ' + (isFGS ? ' disable' : 'enable') + ' this?'}
                      onConfirm={() =>
                        this.setState({
                          isFGS: !isFGS
                        })
                      }
                      okText="Yes"
                      cancelText="No"
                    >
                      <Switch checked={isFGS} size="small" />
                    </Popconfirm>
                  </div>
                </Card>
              </div>
              <Modal
                width={1200}
                maskClosable={false}
                title={'Edit validation setting'}
                visible={visibleApiSetting}
                confirmLoading={loading}
                onCancel={() => this.handleCancel()}
                footer={[
                  <Button
                    key="back"
                    onClick={() => {
                      this.handleCancel();
                    }}
                  >
                    Cancel
                  </Button>,
                  <Button key="submit" type="primary" onClick={this.handleSettingSubmit}>
                    Submit
                  </Button>
                ]}
              >
                <Form {...formItemLayout}>
                  <Row>
                    <Col span={12}>
                      <FormItem label="Validation url">
                        {getFieldDecorator('validationUrl', {
                          rules: [{ required: true, message: 'Validation url is required' }],
                          initialValue: addressSettingForm.validationUrl
                        })(
                          <Input
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'validationUrl',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Client id">
                        {getFieldDecorator('clientId', {
                          rules: [{ required: true, message: 'Client id is required' }],
                          initialValue: addressSettingForm.clientId
                        })(
                          <Input
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'clientId',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Parent key">
                        {getFieldDecorator('parentKey', {
                          rules: [{ required: true, message: 'Parent key is required' }],
                          initialValue: addressSettingForm.parentKey
                        })(
                          <Input
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'parentKey',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Company code">
                        {getFieldDecorator('companyCode', {
                          rules: [{ required: true, message: 'Company code is required' }],
                          initialValue: addressSettingForm.companyCode
                        })(
                          <Input
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'companyCode',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Parent password">
                        {getFieldDecorator('parentPassword', {
                          rules: [{ required: true, message: 'Parent password is required' }],
                          initialValue: addressSettingForm.parentPassword
                        })(
                          <Input.Password
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'parentPassword',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="User key">
                        {getFieldDecorator('userKey', {
                          rules: [{ required: true, message: 'User key is required' }],
                          initialValue: addressSettingForm.userKey
                        })(
                          <Input
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'userKey',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="User password">
                        {getFieldDecorator('userPassword', {
                          rules: [{ required: true, message: 'User password is required' }],
                          initialValue: addressSettingForm.userPassword
                        })(
                          <Input.Password
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'userPassword',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Account number">
                        {getFieldDecorator('accountNumber', {
                          rules: [{ required: true, message: 'Account number is required' }],
                          initialValue: addressSettingForm.accountNumber
                        })(
                          <Input
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'accountNumber',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Meter number">
                        {getFieldDecorator('meterNumber', {
                          rules: [{ required: true, message: 'Meter number is required' }],
                          initialValue: addressSettingForm.meterNumber
                        })(
                          <Input
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'meterNumber',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem label="Client reference id">
                        {getFieldDecorator('clientReferenceId', {
                          rules: [{ required: true, message: 'Client reference id is required' }],
                          initialValue: addressSettingForm.clientReferenceId
                        })(
                          <Input
                            style={{ width: '80%' }}
                            onChange={(e) => {
                              const value = (e.target as any).value;
                              this.onAddressSettingFormChange({
                                field: 'clientReferenceId',
                                value
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </div>
          </Spin>
        </div>
      </AuthWrapper>
    );
  }
}

export default Form.create()(ValidationSetting);
