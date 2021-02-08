import React, { Component } from 'react';
import { Row, Col, Form, Button, message, Input, DatePicker } from 'antd';
import { Const } from 'qmkit';

import { FormattedMessage } from 'react-intl';
const FormItem = Form.Item;
import * as webapi from '../webapi';

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 10 }
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
  }
  componentDidMount() {
    this.getContentInformation();
  }

  getContentInformation = async () => {
    const { res } = await webapi.getStoreContentInfo();
    if (res.code === Const.SUCCESS_CODE) {
      this.setState({
        contentForm: res.context
      });
    }
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.contentForm;
    data[field] = value;
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
          <Row style={{ padding: '0 20px' }}>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="contactUsUrl" />}>
                {getFieldDecorator('contactUsUrl', {
                  initialValue: this.state.contentForm.contactUsUrl,
                  rules: [
                    {
                      required: false,
                      message: 'Please input Contact Us Url'
                    }
                  ]
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'contactUsUrl',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="ourValues" />}>
                {getFieldDecorator('ourValues', {
                  initialValue: this.state.contentForm.ourValues
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'ourValues',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="qualityAndSafety" />}>
                {getFieldDecorator('qualityAndSafety', {
                  initialValue: this.state.contentForm.qualityAndSafety
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'qualityAndSafety',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="specificNutrition" />}>
                {getFieldDecorator('specificNutrition', {
                  initialValue: this.state.contentForm.specificNutrition
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'specificNutrition',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="informationForParents" />}>
                {getFieldDecorator('informationForParents', {
                  initialValue: this.state.contentForm.informationForParents
                })(
                  <Input
                    addonBefore="URL"
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'informationForParents',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="cookies" />}>
                {getFieldDecorator('cookiesUrl', {
                  initialValue: this.state.contentForm.cookiesUrl
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
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="storeContactEmail" />}>
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
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="storeContactPhoneNumber" />}>
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
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="contactTimePeriod" />}>
                {getFieldDecorator('contactTimePeriod', {
                  initialValue: this.state.contentForm.contactTimePeriod,
                  rules: [
                    {
                      required: false,
                      message: 'Please input Contact Time Period Eamil!'
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'contactTimePeriod',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={false} label={<FormattedMessage id="confirmationEmail" />}>
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
    if (res.code === Const.SUCCESS_CODE) {
      message.success('Operate successfully');
    }
  };
}
