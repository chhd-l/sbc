import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb, AuthWrapper, history } from 'qmkit';
import { Row, Col, Form, Modal, message, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from './webapi';

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 12 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

export default class PaymentSetting extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      paymentSetting: {}
    };
    this.getPaymentSetting();
  }

  getPaymentSetting = async () => {
    const { res } = await webapi.getPaymentSetting();
    if (res.code === 'K-000000') {
      this.setState({
        paymentSetting: res.context
      });
    } else {
      message.error(res.message);
    }
  };

  render() {
    return (
      <div>
        <BreadCrumb />
        {/*导航面包屑*/}
        <div className="container">
          <Headline title={<FormattedMessage id="paymentSetting" />} />
          <div style={{ padding: '20px 0 40px 0' }}>
            <Form>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={false}
                    label={<FormattedMessage id="enviroment" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.paymentSetting.enviroment ? (
                        this.state.paymentSetting.enviroment
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={false}
                    label={<FormattedMessage id="URL" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.paymentSetting.url ? (
                        this.state.paymentSetting.url
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={false}
                    label={<FormattedMessage id="appID" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.paymentSetting.appId ? (
                        this.state.paymentSetting.appId
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={false}
                    label={<FormattedMessage id="apiVersion" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.paymentSetting.apiVersion ? (
                        this.state.paymentSetting.apiVersion
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={false}
                    label={<FormattedMessage id="privateKey" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.paymentSetting.privateKey ? (
                        this.state.paymentSetting.privateKey
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={false}
                    label={<FormattedMessage id="publicKey" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.paymentSetting.publicKey ? (
                        this.state.paymentSetting.publicKey
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <AuthWrapper functionName="f_storeInfoEdit_0">
            <div className="bar-button">
              <Button type="primary" onClick={() => this._edit()}>
                <FormattedMessage id="edit" />
              </Button>
            </div>
          </AuthWrapper>
        </div>
      </div>
    );
  }
  _edit = () => {
    history.push('/payment-setting-edit');
  };
}
