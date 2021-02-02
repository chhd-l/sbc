import { edit } from '@/regular-product-add/webapi';
import { Row, Col, Radio, Form, Input, InputNumber } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;

export default class exitRules extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { editable, subscriptionPlan, addField } = this.props;
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
                      disabled={!editable}
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
                  {getFieldDecorator('subscriptionPlanFlag', {
                    initialValue: subscriptionPlan.subscriptionPlanFlag
                  })(
                    <Radio.Group
                      disabled={!editable}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('subscriptionPlanFlag', value);
                      }}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
            </Row>
            {subscriptionPlan.canCancelPlan && subscriptionPlan.subscriptionPlanFlag ? (
              <div>
                <h5>Terms of cancellation</h5>
                <Row className="rules">
                  <FormItem>
                    <strong>Consumer is charged a fee before</strong>
                    {getFieldDecorator('cancellationRefillTimes', {
                      initialValue: subscriptionPlan.cancellationRefillTimes,
                      rules: [{ required: true, message: 'This is Required' }]
                    })(
                      <InputNumber
                        disabled={!editable}
                        min={0}
                        onChange={(value) => {
                          addField('cancellationRefillTimes', value);
                        }}
                      />
                    )}
                    <strong>refills</strong>
                  </FormItem>
                  <FormItem>
                    <strong style={{ marginRight: '10px' }}>Total cancellation fee:</strong>
                    <strong>remaining number of refills *</strong>
                    {getFieldDecorator('cancellationRefillFee', {
                      initialValue: subscriptionPlan.cancellationRefillFee,
                      rules: [{ required: true, message: 'This is Required' }]
                    })(
                      <InputNumber
                        disabled={!editable}
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
                  {getFieldDecorator('changeDeliveryDateFlag', {
                    initialValue: subscriptionPlan.changeDeliveryDateFlag
                  })(
                    <Radio.Group
                      disabled={!editable}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('changeDeliveryDateFlag', value);
                      }}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
              {subscriptionPlan.changeDeliveryDateFlag ? (
                <FormItem>
                  <strong>After</strong>
                  {getFieldDecorator('changeDeliveryDateAfterTimes', {
                    initialValue: subscriptionPlan.changeDeliveryDateAfterTimes,
                    rules: [{ required: true, message: 'This is Required' }]
                  })(
                    <InputNumber
                      disabled={!editable}
                      min={0}
                      onChange={(value) => {
                        addField('changeDeliveryDateAfterTimes', value);
                      }}
                    />
                  )}
                  <strong>delivery times, consumer can change the next delivery date</strong>
                </FormItem>
              ) : null}
            </Row>
            <Row className="rules" style={{ marginTop: '15px' }}>
              <FormItem>
                <Col span={6}>
                  <strong>Skip the next delivery</strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('skipNextDeliveryFlag', {
                    initialValue: subscriptionPlan.skipNextDeliveryFlag
                  })(
                    <Radio.Group
                      disabled={!editable}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('skipNextDeliveryFlag', value);
                      }}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
              {subscriptionPlan.skipNextDeliveryFlag ? (
                <FormItem>
                  <strong>After</strong>
                  {getFieldDecorator('skipNextDeliveryTimes', {
                    initialValue: subscriptionPlan.skipNextDeliveryTimes,
                    rules: [{ required: true, message: 'This is Required' }]
                  })(
                    <InputNumber
                      disabled={!editable}
                      min={0}
                      onChange={(value) => {
                        addField('skipNextDeliveryTimes', value);
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
