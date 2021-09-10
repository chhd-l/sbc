import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history, RCi18n } from 'qmkit';
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
      loading: false,
      isFGS: true,
      visibleApiSetting: false,
      addressApiSettings: [],
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
  componentDidMount() {
    this.init();
  }
  init = () => {
    this.getAddressSetting();
  };

  openEditPage = (item) => {
    let addressSettingForm = {
      id: item.id,
      validationUrl: item.validationUrl,
      clientId: item.clientId,
      parentKey: item.parentKey,
      companyCode: item.companyCode,
      parentPassword: item.parentPassword,
      userKey: item.userKey,
      userPassword: item.userPassword,
      accountNumber: item.accountNumber,
      meterNumber: item.meterNumber,
      clientReferenceId: item.clientReferenceId
    };
    this.setState({
      addressSettingForm,
      visibleApiSetting: true
    });
  };

  handleCancel = () => {
    this.props.form.setFieldsValue();
    this.setState({
      visibleApiSetting: false
    });
  };
  handleSettingSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.editTaxApiSetting();
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
  getAddressSetting = () => {
    this.setState({
      loading: true
    });
    webapi
      .getAddressSetting()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const addressApiSettings = res.context.addressApiSettings;

          let isFGS = false;
          if (addressApiSettings[0].isOpen) {
            isFGS = true;
          }

          this.setState({
            addressApiSettings,
            isFGS,
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  changeSettingStatus = (id) => {
    let params = {
      id,
      isOpen: 1,
      addressApiType: 0
    };
    webapi
      .changeAddressApiSettingStatus(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getAddressSetting();
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  editTaxApiSetting = () => {
    const { addressSettingForm } = this.state;
    let params = {
      id: addressSettingForm.id,
      validationUrl: addressSettingForm.validationUrl,
      clientId: addressSettingForm.clientId,
      parentKey: addressSettingForm.parentKey,
      companyCode: addressSettingForm.companyCode,
      parentPassword: addressSettingForm.parentPassword,
      userKey: addressSettingForm.userKey,
      userPassword: addressSettingForm.userPassword,
      accountNumber: addressSettingForm.accountNumber,
      meterNumber: addressSettingForm.meterNumber,
      clientReferenceId: addressSettingForm.clientReferenceId
    };
    this.setState({
      loading: true
    });
    webapi
      .editAddressApiSetting(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            visibleApiSetting: false,
            loading: false
          });
          this.props.form.setFieldsValue();
          message.success(res.message);
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { loading, isFGS, visibleApiSetting, addressSettingForm, addressApiSettings } = this.state;
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
          <Spin spinning={loading}>
            <BreadCrumb />
            <div className="container">
              <Headline title={RCi18n({id:"Menu.Validation setting"})} />
              <Row style={{ marginBottom: 10 }}>
                {addressApiSettings &&
                  addressApiSettings.map((item, index) => (
                    <Col span={8} key={item.id}>
                      {+item.isCustom ? (
                        <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
                          <div style={{ textAlign: 'center', margin: '12px 0' }}>
                            <h1
                              style={{
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: 'var(--primary-color)'
                              }}
                            >
                              {item.name}
                            </h1>
                            <p><FormattedMessage id="Setting.Setupyourownrule" /></p>
                          </div>
                          <div className="bar" style={{ float: 'right' }}>
                            <Popconfirm title={RCi18n({id:"Setting.EnableTips"})} disabled={+item.isOpen === 1} onConfirm={() => this.changeSettingStatus(item.id)} okText={RCi18n({id:"Setting.Yes"})} cancelText={RCi18n({id:"Setting.No"})}>
                              <Switch checked={item.isOpen === 1} disabled={+item.isOpen === 1} size="small" />
                            </Popconfirm>
                          </div>
                        </Card>
                      ) : (
                        <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
                          <div style={{ textAlign: 'center', height: '90px' }}>
                            <img src={item.imgUrl} style={{ marginTop: 15, height: '60px' }} />
                          </div>
                          <div className="bar" style={{ float: 'right' }}>
                            <Popconfirm title={RCi18n({id:"Setting.EnableTips"})} disabled={+item.isOpen === 1} onConfirm={() => this.changeSettingStatus(item.id)} okText={RCi18n({id:"Setting.Yes"})} cancelText={RCi18n({id:"Setting.No"})}>
                              <Switch checked={item.isOpen === 1} disabled={+item.isOpen === 1} size="small" />
                            </Popconfirm>
                            {item.isOpen ? (
                              <Tooltip placement="top" title={RCi18n({id:"Setting.Edit"})}>
                                <a
                                  style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10
                                  }}
                                  className="iconfont iconEdit"
                                  onClick={() => this.openEditPage(item)}
                                ></a>
                              </Tooltip>
                            ) : null}
                          </div>
                        </Card>
                      )}
                    </Col>
                  ))}
              </Row>

              <Modal
                width={1200}
                maskClosable={false}
                title={RCi18n({id:"Setting.EditValidationSetting"})}
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
                    <FormattedMessage id="Setting.Cancel" />
                  </Button>,
                  <Button key="submit" type="primary" onClick={this.handleSettingSubmit}>
                    <FormattedMessage id="Setting.Submit" />
                  </Button>
                ]}
              >
                <Form {...formItemLayout}>
                  <Row>
                    <Col span={12}>
                      <FormItem label={RCi18n({id:"Setting.ValidationUrl"})}>
                        {getFieldDecorator('validationUrl', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.ValidationUrlRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.ClientId"})}>
                        {getFieldDecorator('clientId', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.ClientIdRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.ParentKey"})}>
                        {getFieldDecorator('parentKey', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.ParentKeyRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.CompanyCode"})}>
                        {getFieldDecorator('companyCode', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.CompanyCodeRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.ParentPassword"})}>
                        {getFieldDecorator('parentPassword', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.ParentPasswordRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.UserKey"})}>
                        {getFieldDecorator('userKey', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.UserKeyRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.UserPassword"})}>
                        {getFieldDecorator('userPassword', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.UserPasswordRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.AccountNumber"})}>
                        {getFieldDecorator('accountNumber', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.AccountNumberRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.MeterNumber"})}>
                        {getFieldDecorator('meterNumber', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.MeterNumberRequired"}) }],
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
                      <FormItem label={RCi18n({id:"Setting.ClientReferId"})}>
                        {getFieldDecorator('clientReferenceId', {
                          rules: [{ required: true, message: RCi18n({id:"Setting.ClientReferIdRequired"}) }],
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
