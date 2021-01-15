import React, { Component } from 'react';
import { Form, Input, DatePicker, Select, Row, Col, message } from 'antd';
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
    this.state = {
      frequencyList: []
    };
  }

  componentDidMount() {
    const { subscriptionPlan, addField } = this.props;
    if (!subscriptionPlan.subscriptionPlanId) {
      subscriptionPlan.subscriptionPlanId = 'SP' + moment(new Date()).format('YYYYMMDDHHSSS');
      addField('subscriptionPlanId', subscriptionPlan.subscriptionPlanId);
    }
    webapi.getWeekFrequency().then((data) => {
      const res = data.res;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          frequencyList: res.context.sysDictionaryVOS
        });
      } else {
        message.error(res.message || 'Get data failed');
      }
    })
    .catch(() => {
      message.error('Get data failed');
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { subscriptionPlan, addField } = this.props;
    const { frequencyList } = this.state;
    return (
      <div>
        <h3>Step1</h3>
        <h4>Basic Information</h4>
        <div className="basicInformation">
          <Form>
            <FormItem {...layout} label="Subscription Plan name">
              {getFieldDecorator('name', {
                initialValue: subscriptionPlan.name,
                rules: [{ required: false, message: 'Please input Subscription Plan Name' }]
              })(
                <Input
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
                rules: [{ required: false, message: 'Please input Subscription Plan ID' }]
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...layout} label="Quantity">
              {getFieldDecorator('quantity', {
                initialValue: subscriptionPlan.quantity,
                rules: [{ required: false, message: 'Please input Quantity' }]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    addField('quantity', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Landing page">
              {getFieldDecorator('landingPage', {
                initialValue: subscriptionPlan.landingPage,
                rules: [{ required: false, message: 'Please input Landing page' }]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    addField('landingPage', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Offer time period">
              {getFieldDecorator('offerTimePeriod', {
                initialValue: subscriptionPlan.startDate && subscriptionPlan.end ? [subscriptionPlan.startDate, subscriptionPlan.endDate] : undefined,
                rules: [{ required: false, message: 'Please select Offer time period' }]
              })(
                <RangePicker
                  onChange={(dates, dateStrings) => {
                    addField('startDate', dateStrings[0]);
                    addField('endDate', dateStrings[0]);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Frequency">
              {getFieldDecorator('frequency', {
                initialValue: subscriptionPlan.frequency,
                rules: [{ required: false, message: 'Please select Frequency' }]
              })(
                <Row style={{color: '#222222'}}>
                  <Col span={4}>
                    <span>Once every</span>
                  </Col>
                  <Col span={12}>
                    <Select
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
                  </Col>
                </Row>
              )}
            </FormItem>
            <FormItem {...layout} label="Number of delivery">
              {getFieldDecorator('delivery', {
                initialValue: subscriptionPlan.delivery,
                rules: [{ required: false, message: 'Please input Number of delivery' }]
              })(
                <Input
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    addField('delivery', value);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...layout} label="Description">
              {getFieldDecorator('description', {
                initialValue: subscriptionPlan.description
              })(
                <Input.TextArea
                  autoSize={{ minRows: 5, maxRows: 10 }}
                  onChange={(e) => {
                    const value = (e.target as any).value;
                    addField('Description', value);
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
