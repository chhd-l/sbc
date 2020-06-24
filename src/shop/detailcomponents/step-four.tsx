import React, { Component } from 'react';
import styled from 'styled-components';
import { Relax, IMap } from 'plume2';
import { Row, Col, Form, Modal, message } from 'antd';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from './../webapi';
import moment from 'moment';

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

export default class StepFour extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      contentInformation: {}
    };
    this.getContentInformation();
  }

  getContentInformation = async () => {
    const { res } = await webapi.getStoreContentInfo();
    if (res.code === 'K-000000') {
      this.setState({
        contentInformation: res.context
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
                  label={<FormattedMessage id="FAQ" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.contentInformation.faqUrl ? (
                      this.state.contentInformation.faqUrl
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
                  label={<FormattedMessage id="cookies" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.contentInformation.cookiesUrl ? (
                      this.state.contentInformation.cookiesUrl
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
                  required={false}
                  label={<FormattedMessage id="privacyPolicy" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.contentInformation.privacyPolicyUrl ? (
                      this.state.contentInformation.privacyPolicyUrl
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
                  label={<FormattedMessage id="termsOfUse" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.contentInformation.termsOfUse ? (
                      this.state.contentInformation.termsOfUse
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
                  required={false}
                  label={<FormattedMessage id="confirmationEmail" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.contentInformation.confirmationEmail ? (
                      this.state.contentInformation.confirmationEmail
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
                  label={<FormattedMessage id="storeContactPhoneNumber" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.contentInformation.storeContactPhoneNumber ? (
                      this.state.contentInformation.storeContactPhoneNumber
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
                  required={false}
                  label={<FormattedMessage id="storeContactEmail" />}
                >
                  <p style={{ color: '#333' }}>
                    {this.state.contentInformation.storeContactEmail ? (
                      this.state.contentInformation.storeContactEmail
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
                  label={<FormattedMessage id="contactTimePeriod" />}
                >
                  <span style={{ color: '#333' }}>
                    {this.state.contentInformation.contactTimePeriodFrom ? (
                      moment(
                        this.state.contentInformation.contactTimePeriodFrom
                      ).format('YYYY-MM-DD hh:ss')
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </span>
                  <span>-</span>
                  <span style={{ color: '#333' }}>
                    {this.state.contentInformation.contactTimePeriodTo ? (
                      moment(
                        this.state.contentInformation.contactTimePeriodTo
                      ).format('YYYY-MM-DD hh:ss')
                    ) : (
                      <FormattedMessage id="none" />
                    )}
                  </span>
                </FormItem>
              </Col>
            </Row>
          </Row>
        </Form>
      </div>
    );
  }
}
