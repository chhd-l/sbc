import { Row, Col, Radio, Form, Input, InputNumber } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;

export default class exitRules extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { subscriptionPlan, addField } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <h3>Step4</h3>
        <h4>Exit Rules</h4>
        <div className="exitRules">
          <Form>
            <h5>Cancellation policy</h5>
            <Row className="rules">
              <FormItem>
                <Col span={8}>
                  <strong>Consumer can choose to cancel the plan</strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('canCancelPlan', {
                    initialValue: subscriptionPlan.canCancelPlan
                  })(
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('canCancelPlan', value);
                      }}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
              <FormItem>
                <Col span={8}>
                  <strong>Consumer is charged a fee upon cancellation</strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('canCancelChargedFee', {
                    initialValue: subscriptionPlan.canCancelChargedFee
                  })(
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('canCancelChargedFee', value);
                      }}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
            </Row>
            {subscriptionPlan.canCancelPlan && subscriptionPlan.canCancelChargedFee ? (
              <div>
                <h5>Terms of cancellation</h5>
                <Row className="rules">
                  <FormItem>
                    <strong>Consumer is charged a fee before</strong>
                    {getFieldDecorator('chargedRefills', {
                      initialValue: subscriptionPlan.chargedRefills,
                      rules: [{ required: true, message: 'This is Required' }]
                    })(
                      <InputNumber
                        min={0}
                        onChange={(value) => {
                          addField('chargedRefills', value);
                        }}
                      />
                    )}
                    <strong>refills</strong>
                  </FormItem>
                  <FormItem>
                    <strong style={{marginRight: '10px'}}>Total cancellation fee:</strong>
                    <strong>remaining number of refills *</strong>
                    {getFieldDecorator('cancellationRefillFee', {
                      initialValue: subscriptionPlan.cancellationRefillFee,
                      rules: [{ required: true, message: 'This is Required' }]
                    })(
                      <InputNumber
                        min={0}
                        onChange={(value) => {
                          addField('cancellationRefillFee', value);
                        }}
                      />
                    )}
                    <strong>cancellation fee per refill </strong>
                  </FormItem>
                </Row>
              </div>
            ) : null}
            <h5>Adjustment rules</h5>
            <Row className="rules">
              <FormItem>
                <Col span={6}>
                  <strong>Change delivery date</strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('canChangeDelivery', {
                    initialValue: subscriptionPlan.canChangeDelivery
                  })(
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('canChangeDelivery', value);
                      }}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
              {subscriptionPlan.canChangeDelivery ? (
                <FormItem>
                  <strong>After</strong>
                  {getFieldDecorator('ChangeDeliveryTime', {
                    initialValue: subscriptionPlan.ChangeDeliveryTime,
                    rules: [{ required: true, message: 'This is Required' }]
                  })(
                    <InputNumber
                      min={0}
                      onChange={(value) => {
                        addField('ChangeDeliveryTime', value);
                      }}
                    />
                  )}
                  <strong>delivery times, consumer can change the next delivery date</strong>
                </FormItem>
              ) : null}
            </Row>
            <Row className="rules" style={{marginTop: '15px'}}>
              <FormItem>
                <Col span={6}>
                  <strong>Skip the next delivery</strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('canSkipNextDelivery', {
                    initialValue: subscriptionPlan.canSkipNextDelivery
                  })(
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('canSkipNextDelivery', value);
                      }}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
              {subscriptionPlan.canSkipNextDelivery ? (
                <FormItem>
                  <strong>After</strong>
                  {getFieldDecorator('skipNextDeliveryTime', {
                    initialValue: subscriptionPlan.skipNextDeliveryTime,
                    rules: [{ required: true, message: 'This is Required' }]
                  })(
                    <InputNumber
                      min={0}
                      onChange={(value) => {
                        addField('skipNextDeliveryTime', value);
                      }}
                    />
                  )}
                  <strong>delivery times, consumer can skip the next delivery</strong>
                </FormItem>
              ) : null}
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
