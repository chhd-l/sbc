import React, { Component } from 'react';
import { Row, Col, Form, Modal, message } from 'antd';
import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from '../webapi';

const formItemLayout = {
  labelCol: {
    span: 3,
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    span: 21,
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
  }
  componentDidMount() {
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
          <Row style={{ padding: '0 20px' }}>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="contactUsUrl" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.contactUsUrl ? this.state.contentInformation.contactUsUrl : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="ourValues" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.ourValues ? this.state.contentInformation.ourValues : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="qualityAndSafety" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.qualityAndSafety ? this.state.contentInformation.qualityAndSafety : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="specificNutrition" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.specificNutrition ? this.state.contentInformation.specificNutrition : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="informationForParents" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.informationForParents ? this.state.contentInformation.informationForParents : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="cookies" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.cookiesUrl ? this.state.contentInformation.cookiesUrl : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="storeContactEmail" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.storeContactEmail ? this.state.contentInformation.storeContactEmail : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="storeContactPhoneNumber" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.storeContactPhoneNumber ? this.state.contentInformation.storeContactPhoneNumber : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="contactTimePeriod" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.contactTimePeriod ? this.state.contentInformation.contactTimePeriod : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="confirmationEmail" />}>
                  <p style={{ color: '#333' }}>{this.state.contentInformation.confirmationEmail ? this.state.contentInformation.confirmationEmail : <FormattedMessage id="none" />}</p>
                </FormItem>
              </Col>
            </Row>
          </Row>
        </Form>
      </div>
    );
  }
}
