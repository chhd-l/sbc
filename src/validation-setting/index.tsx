import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history, RCi18n } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, Modal } from 'antd';
import CustomEditForm, { TEditItem } from './components/CustomEditForm';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
const fedEx = require('./img/FedEx.png');

const FormItem = Form.Item;

class ValidationSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      visibleApiSetting: false,
      addressApiSettings: [],
      editItem: {},
      editItemList: [],
    };
  }
  componentDidMount() {
    this.init();
  }
  init = () => {
    this.getAddressSetting();
  };

  openEditPage = (item) => {
    let editItemList: Array<TEditItem> = [];
    if (item.name === 'FEDEX') {
      editItemList = [
        {
          key: 'validationUrl',
          label: RCi18n({id:"Setting.ValidationUrl"}),
          type: 'string',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.ValidationUrlRequired"}),
          defaultValue: item.validationUrl
        },
        {
          key: 'clientId',
          label: RCi18n({id:"Setting.ClientId"}),
          type: 'string',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.ClientIdRequired"}),
          defaultValue: item.clientId
        },
        {
          key: 'parentKey',
          label: RCi18n({id:"Setting.ParentKey"}),
          type: 'string',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.ParentKeyRequired"}),
          defaultValue: item.parentKey
        },
        {
          key: 'companyCode',
          label: RCi18n({id:"Setting.CompanyCode"}),
          type: 'string',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.CompanyCodeRequired"}),
          defaultValue: item.companyCode
        },
        {
          key: 'parentPassword',
          label: RCi18n({id:"Setting.ParentPassword"}),
          type: 'password',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.ParentPasswordRequired"}),
          defaultValue: item.parentPassword
        },
        {
          key: 'userKey',
          label: RCi18n({id:"Setting.UserKey"}),
          type: 'string',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.UserKeyRequired"}),
          defaultValue: item.userKey
        },
        {
          key: 'userPassword',
          label: RCi18n({id:"Setting.UserPassword"}),
          type: 'password',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.UserPasswordRequired"}),
          defaultValue: item.userPassword
        },
        {
          key: 'accountNumber',
          label: RCi18n({id:"Setting.AccountNumber"}),
          type: 'string',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.AccountNumberRequired"}),
          defaultValue: item.accountNumber
        },
        {
          key: 'meterNumber',
          label: RCi18n({id:"Setting.MeterNumber"}),
          type: 'string',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.MeterNumberRequired"}),
          defaultValue: item.meterNumber
        },
        {
          key: 'clientReferenceId',
          label: RCi18n({id:"Setting.ClientReferId"}),
          type: 'string',
          span: 12,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.ClientReferIdRequired"}),
          defaultValue: item.clientReferenceId
        }
      ];
    } else if (item.name === 'DADATA') {
      editItemList = [
        {
          key: 'validationUrl',
          label: RCi18n({id:"Setting.ValidationUrl"}),
          type: 'string',
          span: 24,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.ValidationUrlRequired"}),
          defaultValue: item.validationUrl
        },
        {
          key: 'userKey',
          label: RCi18n({id:"Setting.UserKey"}),
          type: 'string',
          span: 24,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.UserKeyRequired"}),
          defaultValue: item.userKey
        }
      ];
    } else if (item.name === 'DQE') {
      editItemList = [
        {
          key: 'validationUrl',
          label: RCi18n({id:"Setting.ValidationUrl"}),
          type: 'string',
          span: 24,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.ValidationUrlRequired"}),
          defaultValue: item.validationUrl
        },
        {
          key: 'userPassword',
          label: RCi18n({id:"Setting.UserPassword"}),
          type: 'password',
          span: 24,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.UserPasswordRequired"}),
          defaultValue: item.userPassword
        }
      ];
    } else if (item.name === 'TEMPOLINE') {
      editItemList = [
        {
          key: 'validationUrl',
          label: RCi18n({id:"Setting.ValidationUrl"}),
          type: 'string',
          span: 24,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.ValidationUrlRequired"}),
          defaultValue: item.validationUrl
        },
        {
          key: 'domain',
          label: RCi18n({id:"Setting.domain"}),
          type: 'string',
          span: 24,
          offset: 0,
          required: true,
          requiredMessage: RCi18n({id:"Setting.domainRequired"}),
          defaultValue: JSON.parse(item.requestHeader || '{}')['Domain']
        }
      ];
    }
    
    this.setState({
      editItem: item,
      editItemList,
      visibleApiSetting: true
    });
  };

  handleCancel = () => {
    this.setState({
      visibleApiSetting: false
    });
  };
  handleSuccess = () => {
    this.setState({
      visibleApiSetting: false
    }, this.getAddressSetting);
  };
  getAddressSetting = () => {
    this.setState({
      loading: true
    });
    Promise.all([
      webapi.getAddressSetting(0),
      webapi.getAddressSetting(1)
    ]).then(([data1, data2]) => {
      if (data1.res.code === Const.SUCCESS_CODE && data2.res.code === Const.SUCCESS_CODE) {
        const addressApiSettings = (data1.res.context?.addressApiSettings ?? []).concat(data2.res.context?.addressApiSettings ?? []);
        this.setState({
          addressApiSettings,
          loading: false
        });
      }
    }).catch((err) => {
      this.setState({
        loading: false
      });
    });
  };
  changeSettingStatus = (id: number, addressApiType: number) => {
    let params = {
      id,
      isOpen: 1,
      addressApiType: addressApiType
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

  render() {
    const { loading, visibleApiSetting, editItem, editItemList, addressApiSettings } = this.state;

    return (
      <AuthWrapper functionName="f_validation_setting">
        <div>
          <Spin spinning={loading}>
            <BreadCrumb />
            <div className="container">
              <Headline title={RCi18n({id:"Setting.suggestionSetting"})} />
              <Row gutter={[24,24]} style={{ marginBottom: 10 }}>
                {addressApiSettings.filter(item => item.addressApiType === 1).map((item, index) => (
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
                            <Popconfirm title={RCi18n({id:"Setting.EnableTips"})} disabled={+item.isOpen === 1} onConfirm={() => this.changeSettingStatus(item.id, 1)} okText={RCi18n({id:"Setting.Yes"})} cancelText={RCi18n({id:"Setting.No"})}>
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
                            <Popconfirm title={RCi18n({id:"Setting.EnableTips"})} disabled={+item.isOpen === 1} onConfirm={() => this.changeSettingStatus(item.id, 1)} okText={RCi18n({id:"Setting.Yes"})} cancelText={RCi18n({id:"Setting.No"})}>
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
              
              <div style={{marginTop: 40}}></div>

              <Headline title={RCi18n({id:"Menu.Validation setting"})} />
              <Row gutter={[24,24]} style={{ marginBottom: 10 }}>
                {addressApiSettings.filter(item => item.addressApiType === 0).map((item, index) => (
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
                            <Popconfirm title={RCi18n({id:"Setting.EnableTips"})} disabled={+item.isOpen === 1} onConfirm={() => this.changeSettingStatus(item.id, 0)} okText={RCi18n({id:"Setting.Yes"})} cancelText={RCi18n({id:"Setting.No"})}>
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
                            <Popconfirm title={RCi18n({id:"Setting.EnableTips"})} disabled={+item.isOpen === 1} onConfirm={() => this.changeSettingStatus(item.id, 0)} okText={RCi18n({id:"Setting.Yes"})} cancelText={RCi18n({id:"Setting.No"})}>
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

              {visibleApiSetting && <CustomEditForm
                item={editItem}
                editItemList={editItemList}
                visible={visibleApiSetting}
                onCancel={this.handleCancel}
                onSuccess={this.handleSuccess}
              />}
            </div>
          </Spin>
        </div>
      </AuthWrapper>
    );
  }
}

export default ValidationSetting;
