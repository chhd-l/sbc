import React, { Component } from 'react';
import { Form, Input, Checkbox, Row, Col } from 'antd';
const FormItem = Form.Item;

export default class entryCriteria extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { subscriptionPlan, addField } = this.props;
    return (
      <div>
        <h3>Step3</h3>
        <h4>Entry Criteria</h4>
        <div className="entryCriteria">
          <Form>
            <FormItem>
              <Checkbox
                checked={subscriptionPlan.signOnSubscription === 1 ? true : false}
                onChange={(e) => {
                  subscriptionPlan.signOnSubscription = e.target.checked ? 1 : 0;
                  addField('signOnSubscription', subscriptionPlan.signOnSubscription);
                }}
              >
                Sign On Subscription
              </Checkbox>
              <span className="checkBoxTip">Consumers need consent to sign on subscription</span>
            </FormItem>
            <FormItem>
              <Checkbox
                checked={subscriptionPlan.otherPromotion === 1 ? true : false}
                onChange={(e) => {
                  subscriptionPlan.otherPromotion = e.target.checked ? 1 : 0;
                  addField('signOnSubscription', subscriptionPlan.otherPromotion);
                }}
              >
                Subscription Plan
              </Checkbox>
              <span className="checkBoxTip">Subscription plan can be applied with other promotions</span>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
