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

export default class PaymentForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      store: {},
      contentForm: {}
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
      <div style={{ padding: '20px 0 40px 0' }}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="FAQ" />}
              >
                {getFieldDecorator('taxRate', {
                  initialValue: this.state.store.taxRate,
                  rules: [{ required: true, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'taxRate',
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
                required={true}
                label={<FormattedMessage id="confirmationEmail" />}
              >
                {getFieldDecorator('taxRate', {
                  initialValue: this.state.store.taxRate,
                  rules: [{ required: true, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'taxRate',
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
                required={true}
                label={<FormattedMessage id="privacyPolicy" />}
              >
                {getFieldDecorator('taxRate', {
                  initialValue: this.state.store.taxRate,
                  rules: [{ required: true, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'taxRate',
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
                required={true}
                label={<FormattedMessage id="termsOfUse" />}
              >
                {getFieldDecorator('taxRate', {
                  initialValue: this.state.store.taxRate,
                  rules: [{ required: true, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'taxRate',
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
                required={true}
                label={<FormattedMessage id="cookies" />}
              >
                {getFieldDecorator('taxRate', {
                  initialValue: this.state.store.taxRate,
                  rules: [{ required: true, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'taxRate',
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
                required={true}
                label={<FormattedMessage id="storeContactPhoneNumber" />}
              >
                {getFieldDecorator('taxRate', {
                  initialValue: this.state.store.taxRate,
                  rules: [{ required: true, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'taxRate',
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
                required={true}
                label={<FormattedMessage id="storeContactEmail" />}
              >
                {getFieldDecorator('taxRate', {
                  initialValue: this.state.store.taxRate,
                  rules: [{ required: true, message: 'Please input taxRate!' }]
                })(
                  <Input
                    onChange={(e: any) =>
                      this.onFormChange({
                        field: 'taxRate',
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
                required={true}
                label={<FormattedMessage id="contactTimePeriod" />}
              >
                {
                  <RangePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('11:59:59', 'HH:mm:ss')
                      ]
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                }
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
}
