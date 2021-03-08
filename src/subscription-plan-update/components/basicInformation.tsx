import React, { Component } from 'react';
import { Form, Input, DatePicker, Select, Row, Col, message, InputNumber, Switch } from 'antd';
import moment from 'moment';
import { Const } from 'qmkit';
import * as webapi from '../webapi';
import { FormattedMessage } from 'react-intl';
import { FORMERR } from 'dns';

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
    const { Subscription, addField } = this.props;
    if (!Subscription.SubscriptionId) {
      Subscription.SubscriptionId = 'SP' + moment(new Date()).format('YYMMDDHHmmSSS');
      addField('SubscriptionId', Subscription.SubscriptionId);
    }
  }

  offerTimePeriodValidator = (rule, value, callback) => {
    const { editable } = this.props;
    if (editable && value && value.length && value[0] < moment().startOf('day')) {
      callback('Start Date invalid');
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editable, Subscription, addField, frequencyList, planTypeList } = this.props;

    return (
      <div>
        <h3>
          <FormattedMessage id="Subscription.Step1" />
        </h3>
        <h4>
          <FormattedMessage id="Subscription.BasicInformation" />
        </h4>
        <div className="basicInformation">
          <Form>
            <FormItem {...layout} label={<FormattedMessage id="Subscription.PlanType" />}>
              {getFieldDecorator('type', {
                initialValue: Subscription.type,
                rules: [{ required: true, message: <FormattedMessage id="Subscription.PleaseInput" /> }]
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
            <FormItem {...layout} label={<FormattedMessage id="Subscription.SubscriptionName" />}>
              {getFieldDecorator('name', {
                initialValue: Subscription.name,
                rules: [{ required: true, message: <FormattedMessage id="Subscription.PleasePlanName" /> }]
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
            <FormItem {...layout} label={<FormattedMessage id="Subscription.SubscriptionID" />}>
              {getFieldDecorator('SubscriptionId ', {
                initialValue: Subscription.SubscriptionId,
                rules: [{ required: true, message: <FormattedMessage id="Subscription.PleasePlanID" /> }]
              })(<Input disabled={true} />)}
            </FormItem>
            <FormItem {...layout} label={<FormattedMessage id="Subscription.Quantity" />}>
              {getFieldDecorator('quantity', {
                initialValue: Subscription.quantity,
                rules: [{ required: true, message: <FormattedMessage id="Subscription.PleaseInputQuantity" /> }]
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
            <FormItem {...layout} label={<FormattedMessage id="Subscription.LandingPage" />}>
              {getFieldDecorator('landingPage', {
                initialValue: Subscription.landingPage,
                rules: [{ required: true, message: <FormattedMessage id="Subscription.PleaseInputLanding" /> }]
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
            <FormItem {...layout} label={<FormattedMessage id="Subscription.EnableLanding" />}>
              {getFieldDecorator('landingFlag', {
                valuePropName: 'checked',
                initialValue: Subscription.landingFlag
              })(<Switch disabled={!editable} onChange={(value) => addField('landingFlag', value)} />)}
            </FormItem>
            <FormItem {...layout} label={<FormattedMessage id="Subscription.OfferTimePeriod" />}>
              {getFieldDecorator('offerTimePeriod', {
                initialValue: Subscription.startDate && Subscription.endDate ? [moment(Subscription.startDate), moment(Subscription.endDate)] : undefined,
                rules: [{ required: true, message: <FormattedMessage id="Subscription.PleaseSelectOffer" /> }, { validator: this.offerTimePeriodValidator }]
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
            <FormItem {...layout} label={<FormattedMessage id="Subscription.Frequency" />}>
              <Row style={{ color: '#222222' }}>
                <Col span={4}>
                  <span>Once every</span>
                </Col>
                <Col span={20}>
                  {getFieldDecorator('frequency', {
                    initialValue: Subscription.frequency.map((fre) => parseInt(fre)),
                    rules: [{ required: true, message: <FormattedMessage id="Subscription.PleaseSelectFrequency" /> }]
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
            <FormItem {...layout} label={<FormattedMessage id="Subscription.NumberOfDelivery" />}>
              {getFieldDecorator('delivery', {
                initialValue: Subscription.deliveryTimes,
                rules: [{ required: true, message: <FormattedMessage id="Subscription.PleaseInputNumber" /> }]
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
            <FormItem {...layout} label={<FormattedMessage id="Subscription.Description" />}>
              {getFieldDecorator('description', {
                initialValue: Subscription.description
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
