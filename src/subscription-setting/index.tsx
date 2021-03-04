import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Switch, Modal, Button, Form, Input, Row, Col, message, Select, Radio, Alert, InputNumber, Tabs } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
export default class SubscriptionSetting extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: <FormattedMessage id="SubscriptionSetting.SubscriptionSetting" />,
      settingForm: {
        newOrdersId: null,
        newOrdersStatus: 0,
        newOrdersValue: 0,
        cardExpirationId: null,
        cardExpirationStatus: 0,
        cardExpirationValue: 0
      }
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
          this.setState({
            settingForm
          });
        }
      })
      .catch((err) => {});
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
        }
      ]
    };
    webapi
      .updateSetting(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(<FormattedMessage id="SubscriptionSetting.OperationSuccessful" />);
        }
      })
      .catch((err) => {});
  };
  render() {
    const { title, settingForm } = this.state;
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container-search">
          <Headline title={title} />
          <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} labelAlign="right">
            <FormItem label={<FormattedMessage id="SubscriptionSetting.RemindOfNewOrders" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
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
                        <FormattedMessage id="SubscriptionSetting.Days1" />
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            </FormItem>

            <FormItem label={<FormattedMessage id="SubscriptionSetting.RemindOfCardExpiration" />}>
              <Row>
                <Col span={1}>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
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
                        <FormattedMessage id="SubscriptionSetting.Days2" />
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
            {<FormattedMessage id="SubscriptionSetting.save" />}
          </Button>
        </div>
      </div>
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
