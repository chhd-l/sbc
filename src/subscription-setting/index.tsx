import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Switch, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Alert, InputNumber, Tabs, Spin } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage,injectIntl } from 'react-intl';

const FormItem = Form.Item;
 class Subscription extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="Subscription.Setting" />,
      settingForm: {
        newOrdersId: null,
        newOrdersStatus: 0,
        newOrdersValue: 0,
        cardExpirationId: null,
        cardExpirationStatus: 0,
        cardExpirationValue: 0,
        switchProductId:null,
        switchProductStatus:0,
        switchProductValue:0,
        emailReminderId:null,
        emailReminderStatus:0,
        emailReminderValue:0,
      },
      loading:false,
    };
  }
  componentDidMount() {
    this.getSettingConfig();
  }
  settingFormChange = ({ field, value }) => {
    let data = this.state.settingForm;
    data[field] = value;
    this.setState({
      settingForm: data
    });
  };
  getSettingConfig = () => {
    this.setState({
      loading:true
    })
    webapi
      .getSettingConfig()
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          const { settingForm } = this.state;
          let newOrderConfig = res.context.find((item) => {
            return item.configType === 'subscription_new_order_send_email';
          });
          let cardExpirationConfig = res.context.find((item) => {
            return item.configType === 'subscription_tied_card_failure';
          });
          let switchProductConfig = res.context.find((item) => {
            return item.configType === 'subscription_next_life_stage';
          });
          let emailReminderConfig = res.context.find((item) => {
            return item.configType === 'subscription_create_order_error_number';
          });
          if (newOrderConfig) {
            settingForm.newOrdersId = newOrderConfig.id;
            settingForm.newOrdersStatus = newOrderConfig.status;
            settingForm.newOrdersValue = newOrderConfig.context;
          }
          if (cardExpirationConfig) {
            settingForm.cardExpirationId = cardExpirationConfig.id;
            settingForm.cardExpirationStatus = cardExpirationConfig.status;
            settingForm.cardExpirationValue = cardExpirationConfig.context;
          }
          if (switchProductConfig) {
            settingForm.switchProductId = switchProductConfig.id;
            settingForm.switchProductStatus = switchProductConfig.status;
            settingForm.switchProductValue = switchProductConfig.context;
          }
          if (emailReminderConfig) {
            settingForm.emailReminderId = emailReminderConfig.id;
            settingForm.emailReminderStatus = emailReminderConfig.status;
            settingForm.emailReminderValue = emailReminderConfig.context;
          }
          this.setState({
            settingForm,
            loading:false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading:false
        })
      });
  };
  updateSetting = () => {
    const { settingForm } = this.state;
    let params = {
      requestList: [
        {
          context: settingForm.newOrdersValue,
          id: settingForm.newOrdersId,
          status: settingForm.newOrdersStatus ? 1 : 0
        },
        {
          context: settingForm.cardExpirationValue,
          id: settingForm.cardExpirationId,
          status: settingForm.cardExpirationStatus ? 1 : 0
        },
        {
          context: settingForm.switchProductValue,
          id: settingForm.switchProductId,
          status: settingForm.switchProductStatus ? 1 : 0
        },
        {
          context: settingForm.emailReminderValue,
          id: settingForm.emailReminderId,
          status: settingForm.emailReminderStatus ? 1 : 0
        }
      ]
    };
    this.setState({
      loading:true
    })
    webapi
      .updateSetting(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(RCi18n({id:'Subscription.OperationSuccessful'}));
          this.setState({
            loading:false
          })
        }
      })
      .catch((err) => {
        this.setState({
          loading:false
        })
      });
  };
  render() {
    const { title, settingForm } = this.state;
    return (
      <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="right">
            <FormItem label={<FormattedMessage id="Subscription.RemindOfNewOrders" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.newOrdersStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'newOrdersStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.newOrdersStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        precision={0}
                        min={0}
                        max={9999}
                        value={settingForm.newOrdersValue}
                        onChange={(value) =>
                          this.settingFormChange({
                            field: 'newOrdersValue',
                            value: value
                          })
                        }
                      />
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.Days1" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </FormItem>

            <FormItem label={<FormattedMessage id="Subscription.RemindOfCardExpiration" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.cardExpirationStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'cardExpirationStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.cardExpirationStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        precision={0}
                        min={1}
                        max={9999}
                        value={settingForm.cardExpirationValue}
                        onChange={(value) =>
                          this.settingFormChange({
                            field: 'cardExpirationValue',
                            value: value
                          })
                        }
                      />
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.Days2" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </FormItem>

            <FormItem label={<FormattedMessage id="Subscription.ReminderSwitchProduct" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.switchProductStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'switchProductStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.switchProductStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        precision={0}
                        min={0}
                        max={9999}
                        value={settingForm.switchProductValue}
                        onChange={(value) =>
                          this.settingFormChange({
                            field: 'switchProductValue',
                            value: value
                          })
                        }
                      />
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.ReminderSwitchProductDesc" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </FormItem>

            <FormItem label={<FormattedMessage id="Subscription.EmailReminderIntervals" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren={<FormattedMessage id="Subscription.On" />}
                    unCheckedChildren={<FormattedMessage id="Subscription.Off" />}
                    checked={settingForm.emailReminderStatus ? true : false}
                    onChange={(value) =>
                      this.settingFormChange({
                        field: 'emailReminderStatus',
                        value: value
                      })
                    }
                  />
                </Col>
                {settingForm.emailReminderStatus ? (
                  <Col span={20}>
                    <div style={styles.inputStyle}>
                      <InputNumber
                        precision={0}
                        min={0}
                        max={9999}
                        value={settingForm.emailReminderValue}
                        onChange={(value) =>
                          this.settingFormChange({
                            field: 'emailReminderValue',
                            value: value
                          })
                        }
                      />
                      <span style={{ marginLeft: 10 }}>
                        <FormattedMessage id="Subscription.EmailReminderIntervalsDesc" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </FormItem>
          </Form>
        </div>
        <div className="bar-button">
          <Button type="primary" shape="round" style={{ marginRight: 10 }} onClick={() => this.updateSetting()}>
            {<FormattedMessage id="Subscription.save" />}
          </Button>
        </div>
      </Spin>
    );
  }
}

const styles = {
  inputStyle: {
    display: 'inline-block',
    marginLeft: '20px'
  },
  tipsStyle: {
    fontSize: 16,
    lineHeight: 1,
    margin: '20px 0 10px 0'
  }
} as any;
export default injectIntl(Subscription)