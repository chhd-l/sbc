import React, { Component } from 'react';
import styled from 'styled-components';
import { Relax, IMap } from 'plume2';
import { Row, Col, Form, Button, message, Input, DatePicker } from 'antd';
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

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

export default class StepFour extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      contentForm: {}
    };
    this.getContentInformation();
  }

  getContentInformation = async () => {
    const { res } = await webapi.getStoreContentInfo();
    if (res.code === 'K-000000') {
      this.setState({
        contentForm: res.context
      });
    } else {
      message.error(res.message);
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.contentForm;
    if (field === 'contactTimePeriod') {
      data['contactTimePeriodFrom'] = moment(value[0]).format(
        'YYYY-MM-DD hh:mm:ss'
      );
      data['contactTimePeriodTo'] = moment(value[1]).format(
        'YYYY-MM-DD hh:mm:ss'
      );
    } else {
      data[field] = value;
    }
    this.setState({
      contentForm: data
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { MonthPicker, RangePicker } = DatePicker;

    return (
      <div>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="FAQ" />}
              >
                {getFieldDecorator('faqUrl', {
                  initialValue: this.state.contentForm.faqUrl,
                  rules: [{ required: false, message: 'Please input FAQ Url!' }]
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'faqUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="cookies" />}
              >
                {getFieldDecorator('cookiesUrl', {
                  initialValue: this.state.contentForm.cookiesUrl,
                  rules: [
                    { required: false, message: 'Please input Cookies Url!' }
                  ]
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'cookiesUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="privacyPolicy" />}
              >
                {getFieldDecorator('privacyPolicyUrl', {
                  initialValue: this.state.contentForm.privacyPolicyUrl,
                  rules: [
                    {
                      required: false,
                      message: 'Please input Privacy Policy Url!'
                    }
                  ]
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'privacyPolicyUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="termsOfUse" />}
              >
                {getFieldDecorator('termsOfUse', {
                  initialValue: this.state.contentForm.termsOfUse,
                  rules: [
                    { required: false, message: 'Please input Terms Of Use!' }
                  ]
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'termsOfUse',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="confirmationEmail" />}
              >
                {getFieldDecorator('confirmationEmail', {
                  initialValue: this.state.contentForm.confirmationEmail,
                  rules: [
                    {
                      required: false,
                      message: 'Please input Confirmation Email!'
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'confirmationEmail',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="storeContactPhoneNumber" />}
              >
                {getFieldDecorator('storeContactPhoneNumber', {
                  initialValue: this.state.contentForm.storeContactPhoneNumber,
                  rules: [
                    {
                      required: false,
                      message: 'Please input Store Contact Phone Number!'
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'storeContactPhoneNumber',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="storeContactEmail" />}
              >
                {getFieldDecorator('storeContactEmail', {
                  initialValue: this.state.contentForm.storeContactEmail,
                  rules: [
                    {
                      required: false,
                      message: 'Please input Store Contact Email!'
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'storeContactEmail',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="contactTimePeriod" />}
              >
                {getFieldDecorator('contactTimePeriod', {
                  initialValue: [
                    moment(this.state.contentForm.contactTimePeriodFrom),
                    moment(this.state.contentForm.contactTimePeriodTo)
                  ],
                  rules: [
                    {
                      required: false,
                      message: 'Please input Store Contact Time Period!'
                    }
                  ]
                })(
                  <RangePicker
                    onChange={(dateRange) =>
                      this.onFormChange({
                        field: 'contactTimePeriod',
                        value: dateRange
                      })
                    }
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('11:59:59', 'HH:mm:ss')
                      ]
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={this._next}>
                  <FormattedMessage id="save" />
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  _next = () => {
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this.onSave();
      }
    });
  };

  onSave = async () => {
    const contentForm = this.state.contentForm;
    const { res } = await webapi.saveStoreContentInfo({
      ...contentForm
    });
    if (res.code === 'K-000000') {
      message.success(res.message || 'save successful');
    } else {
      message.error(res.message || 'save faild');
    }
  };
}
