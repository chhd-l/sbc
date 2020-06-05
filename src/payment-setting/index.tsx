import React, { Component } from 'react';
import { Headline, SelectGroup, BreadCrumb } from 'qmkit';
import { Row, Col, Form, Modal, message } from 'antd';
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
      store: {}
    };
    this.getContentInformation();
  }

  getContentInformation = async () => {
    const { res } = await webapi.fetchStoreInfo();
    if (res.code === 'K-000000') {
      this.setState({
        store: res.context
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
          <Headline title={<FormattedMessage id="none" />} />
          <div style={{ padding: '20px 0 40px 0' }}>
            <Form>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={true}
                    label={<FormattedMessage id="FAQ" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.store.taxRate ? (
                        this.state.store.taxRate
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={true}
                    label={<FormattedMessage id="confirmationEmail" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.store.taxRate ? (
                        this.state.store.taxRate
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={true}
                    label={<FormattedMessage id="privacyPolicy" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.store.taxRate ? (
                        this.state.store.taxRate
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={true}
                    label={<FormattedMessage id="termsOfUse" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.store.taxRate ? (
                        this.state.store.taxRate
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={true}
                    label={<FormattedMessage id="cookies" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.store.taxRate ? (
                        this.state.store.taxRate
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={true}
                    label={<FormattedMessage id="storeContactPhoneNumber" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.store.taxRate ? (
                        this.state.store.taxRate
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={true}
                    label={<FormattedMessage id="storeContactEmail" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.store.taxRate ? (
                        this.state.store.taxRate
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    required={true}
                    label={<FormattedMessage id="contactTimePeriod" />}
                  >
                    <p style={{ color: '#333' }}>
                      {this.state.store.taxRate ? (
                        this.state.store.taxRate
                      ) : (
                        <FormattedMessage id="none" />
                      )}
                    </p>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
