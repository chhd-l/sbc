import React, { Component } from 'react';
import { Form, Input, DatePicker, Select, Row, Col, message, InputNumber, Switch } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';
import * as webapi from '../webapi';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 }
};

export default class basicInformation extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { subscriptionPlan, addField } = this.props;
    if (!subscriptionPlan.subscriptionPlanId) {
      subscriptionPlan.subscriptionPlanId = 'SP' + moment(new Date()).format('YYMMDDHHmmSSS');
      addField('subscriptionPlanId', subscriptionPlan.subscriptionPlanId);
    }
  }

  offerTimePeriodValidator = (rule, value, callback) => {
    if (value[0] < moment().startOf('day')) {
      callback('Start Date invalid');
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editable, subscriptionPlan, addField, frequencyList, planTypeList } = this.props;

    return (
      <div>
        <h3>Step1</h3>
        <h4>Basic Information</h4>
        <div className="basicInformation">
          <Form>
            <FormItem {...layout} label="Subscription Plan type">
              {getFieldDecorator('type', {
                initialValue: subscriptionPlan.type,
                rules: [{ required: true, message: 'Please input Subscription Plan Type' }]
              })(
                <Select
                  disabled={!editable}
                  onChange={(value: any) => {
                    addField('type', value);
                  }}
                >
                  {planTypeList.map((item, index) => (
                    <Option value={item.name} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...layout} label="Subscription Plan name">
              {getFieldDecorator('name', {
                initialValue: subscriptionPlan.name,
                rules: [{ required: true, message: 'Please input Subscription Plan Name' }]
              })(
                <Input
                  disabled={!editable}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    addField('name', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Subscription Plan ID">
              {getFieldDecorator('subscriptionPlanId ', {
                initialValue: subscriptionPlan.subscriptionPlanId,
                rules: [{ required: true, message: 'Please input Subscription Plan ID' }]
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...layout} label="Quantity">
              {getFieldDecorator('quantity', {
                initialValue: subscriptionPlan.quantity,
                rules: [{ required: true, message: 'Please input Quantity' }]
              })(
                <InputNumber
                  precision={0}
                  min={1}
                  max={100}
                  disabled={true}
                  onChange={(value) => {
                    addField('quantity', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Landing page">
              {getFieldDecorator('landingPage', {
                initialValue: subscriptionPlan.landingPage,
                rules: [{ required: true, message: 'Please input Landing page' }]
              })(
                <Input
                  disabled={!editable}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    addField('landingPage', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Enable landing page">
              {getFieldDecorator('landingFlag', {
                valuePropName: 'checked',
                initialValue: subscriptionPlan.landingFlag
              })(<Switch disabled={!editable} onChange={(value) => addField('landingFlag', value)} />)}
            </FormItem>
            <FormItem {...layout} label="Offer time period">
              {getFieldDecorator('offerTimePeriod', {
                initialValue: subscriptionPlan.startDate && subscriptionPlan.endDate ? [moment(subscriptionPlan.startDate), moment(subscriptionPlan.endDate)] : undefined,
                rules: [{ required: true, message: 'Please select Offer time period' }, { validator: this.offerTimePeriodValidator }]
              })(
                <RangePicker
                  disabled={!editable}
                  disabledDate={(current) => current < moment().startOf('day')}
                  onChange={(dates, dateStrings) => {
                    addField('startDate', dateStrings[0]);
                    addField('endDate', dateStrings[1]);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Frequency">
              <Row style={{ color: '#222222' }}>
                <Col span={4}>
                  <span>Once every</span>
                </Col>
                <Col span={20}>
                  {getFieldDecorator('frequency', {
                    initialValue: subscriptionPlan.frequency,
                    rules: [{ required: true, message: 'Please select Frequency' }]
                  })(
                    <Select
                      disabled={!editable}
                      mode="multiple"
                      onChange={(value: any) => {
                        this.props.addField('frequency', value);
                      }}
                    >
                      {frequencyList.map((item, index) => (
                        <Option value={item.id} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem {...layout} label="Number of delivery">
              {getFieldDecorator('delivery', {
                initialValue: subscriptionPlan.deliveryTimes,
                rules: [{ required: true, message: 'Please input Number of delivery' }]
              })(
                <InputNumber
                  disabled={!editable}
                  precision={0}
                  min={1}
                  max={100}
                  onChange={(value) => {
                    addField('deliveryTimes', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Description">
              {getFieldDecorator('description', {
                initialValue: subscriptionPlan.description
              })(
                <Input.TextArea
                  disabled={!editable}
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    addField('description', value);
                  }}
                />
              )}
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
