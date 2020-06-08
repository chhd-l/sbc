import React from 'react';
import { Relax, IMap } from 'plume2';
import { Row, Col, Form, Modal, message } from 'antd';
import styled from 'styled-components';

import moment from 'moment';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from './../webapi';

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

export default class StepTwo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      sso: {}
    };
    this.getContentInformation();
  }

  getContentInformation = async () => {
    const { res } = await webapi.getStoreSooSetting();
    if (res.code === 'K-000000') {
      this.setState({
        sso: res.context
      });
    } else {
      message.error(res.message);
    }
  };

  render() {
    return (
      <div>
        <Form>
          <Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  required={false}
                  label={<FormattedMessage id="logIn" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.sso.logIn ? (
                      this.state.sso.logIn
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
                  label={<FormattedMessage id="UserinfoURL" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.sso.userInfoUrl ? (
                      this.state.sso.userInfoUrl
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="clientID" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.sso.clientId ? (
                      this.state.sso.clientId
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="issuer" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.sso.issuer ? (
                      this.state.sso.issuer
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="pedirectURL" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.sso.redirectUrl ? (
                      this.state.sso.redirectUrl
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="registration" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.sso.registration ? (
                      this.state.sso.registration
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="registerPrefix" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.sso.registerPrefix ? (
                      this.state.sso.registerPrefix
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="registerCallback" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.sso.registerCallback ? (
                      this.state.sso.registerCallback
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </p>
                </FormItem>
              </Col>
            </Row>
          </Row>
        </Form>
      </div>
    );
  }
}
