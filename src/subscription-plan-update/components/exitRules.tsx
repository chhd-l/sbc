import { edit } from '@/regular-product-add/webapi';
import { Row, Col, Radio, Form, Input, InputNumber } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

export default class exitRules extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { editable, Subscription, addField } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <h3>
          <FormattedMessage id="Subscription.Step4" />
        </h3>
        <h4>
          <FormattedMessage id="Subscription.ExitRules" />
        </h4>
        <div className="exitRules">
          <Form>
            <h5>
              <FormattedMessage id="Subscription.CancellationPolicy" />
            </h5>
            <Row className="rules">
              <FormItem>
                <Col span={8}>
                  <strong>
                    <FormattedMessage id="Subscription.ConsumerCanChoose" />
                  </strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('canCancelPlan', {
                    initialValue: Subscription.canCancelPlan
                  })(
                    <Radio.Group
                      disabled={!editable}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('canCancelPlan', value);
                      }}
                    >
                      <Radio value={true}>
                        <FormattedMessage id="Subscription.Yes" />
                      </Radio>
                      <Radio value={false}>
                        <FormattedMessage id="Subscription.No" />
                      </Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
              <FormItem>
                <Col span={8}>
                  <strong>
                    <FormattedMessage id="Subscription.ConsumerIsCharged" />
                  </strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('SubscriptionFlag', {
                    initialValue: Subscription.SubscriptionFlag
                  })(
                    <Radio.Group
                      disabled={!editable}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('SubscriptionFlag', value);
                      }}
                    >
                      <Radio value={true}>
                        <FormattedMessage id="Subscription.Yes" />
                      </Radio>
                      <Radio value={false}>
                        <FormattedMessage id="Subscription.No" />
                      </Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
            </Row>
            {Subscription.canCancelPlan && Subscription.SubscriptionFlag ? (
              <div>
                <h5>
                  <FormattedMessage id="Subscription.TermsOfCancellation" />
                </h5>
                <Row className="rules">
                  <FormItem>
                    <strong>
                      <FormattedMessage id="Subscription.ConsumerIsChargedBefore" />
                    </strong>
                    {getFieldDecorator('cancellationRefillTimes', {
                      initialValue: Subscription.cancellationRefillTimes,
                      rules: [{ required: true, message: <FormattedMessage id="Subscription.ThisIsRequired" /> }]
                    })(
                      <InputNumber
                        disabled={!editable}
                        min={0}
                        onChange={(value) => {
                          addField('cancellationRefillTimes', value);
                        }}
                      />
                    )}
                    <strong>
                      <FormattedMessage id="Subscription.refills" />
                    </strong>
                  </FormItem>
                  <FormItem>
                    <strong style={{ marginRight: '10px' }}>
                      <FormattedMessage id="Subscription.TotalCancellationFee" />:
                    </strong>
                    <strong>
                      <FormattedMessage id="Subscription.remainingNumberOfRefills" /> *
                    </strong>
                    {getFieldDecorator('cancellationRefillFee', {
                      initialValue: Subscription.cancellationRefillFee,
                      rules: [{ required: true, message: <FormattedMessage id="Subscription.ThisIsRequired" /> }]
                    })(
                      <InputNumber
                        disabled={!editable}
                        min={0}
                        onChange={(value) => {
                          addField('cancellationRefillFee', value);
                        }}
                      />
                    )}
                    <strong>
                      <FormattedMessage id="Subscription.cancellationFeePerRefill" />
                    </strong>
                  </FormItem>
                </Row>
              </div>
            ) : null}
            <h5>
              <FormattedMessage id="Subscription.AdjustmentRules" />
            </h5>
            <Row className="rules">
              <FormItem>
                <Col span={6}>
                  <strong>
                    <FormattedMessage id="Subscription.ChangeDeliveryDate" />
                  </strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('changeDeliveryDateFlag', {
                    initialValue: Subscription.changeDeliveryDateFlag
                  })(
                    <Radio.Group
                      disabled={!editable}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('changeDeliveryDateFlag', value);
                      }}
                    >
                      <Radio value={true}>
                        <FormattedMessage id="Subscription.Yes" />
                      </Radio>
                      <Radio value={false}>
                        <FormattedMessage id="Subscription.No" />
                      </Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
              {Subscription.changeDeliveryDateFlag ? (
                <FormItem>
                  <strong>
                    <FormattedMessage id="Subscription.After" />
                  </strong>
                  {getFieldDecorator('changeDeliveryDateAfterTimes', {
                    initialValue: Subscription.changeDeliveryDateAfterTimes,
                    rules: [{ required: true, message: <FormattedMessage id="Subscription.ThisIsRequired" /> }]
                  })(
                    <InputNumber
                      disabled={!editable}
                      min={0}
                      onChange={(value) => {
                        addField('changeDeliveryDateAfterTimes', value);
                      }}
                    />
                  )}
                  <strong>
                    <FormattedMessage id="Subscription.deliveryTimesDate" />
                  </strong>
                </FormItem>
              ) : null}
            </Row>
            <Row className="rules" style={{ marginTop: '15px' }}>
              <FormItem>
                <Col span={6}>
                  <strong>
                    <FormattedMessage id="Subscription.SkipTheNextDelivery" />
                  </strong>
                </Col>
                <Col span={4}>
                  {getFieldDecorator('skipNextDeliveryFlag', {
                    initialValue: Subscription.skipNextDeliveryFlag
                  })(
                    <Radio.Group
                      disabled={!editable}
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        addField('skipNextDeliveryFlag', value);
                      }}
                    >
                      <Radio value={true}>
                        <FormattedMessage id="Subscription.Yes" />
                      </Radio>
                      <Radio value={false}>
                        <FormattedMessage id="Subscription.No" />
                      </Radio>
                    </Radio.Group>
                  )}
                </Col>
              </FormItem>
              {Subscription.skipNextDeliveryFlag ? (
                <FormItem>
                  <strong>
                    <FormattedMessage id="Subscription.After" />
                  </strong>
                  {getFieldDecorator('skipNextDeliveryTimes', {
                    initialValue: Subscription.skipNextDeliveryTimes,
                    rules: [{ required: true, message: <FormattedMessage id="Subscription.ThisIsRequired" /> }]
                  })(
                    <InputNumber
                      disabled={!editable}
                      min={0}
                      onChange={(value) => {
                        addField('skipNextDeliveryTimes', value);
                      }}
                    />
                  )}
                  <strong>
                    <FormattedMessage id="Subscription.deliveryTimes" />
                  </strong>
                </FormItem>
              ) : null}
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
