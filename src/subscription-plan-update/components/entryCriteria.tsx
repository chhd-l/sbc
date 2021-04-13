import React, { Component } from 'react';
import { Form, Input, Checkbox, Row, Col, Select, Button, Tooltip } from 'antd';
import AddConsent from '../modals/addConsent';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 }
};
export default class entryCriteria extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      allConsents: []
    };

    this.showAddConsent = this.showAddConsent.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.getAllConsent = this.getAllConsent.bind(this);
  }

  showAddConsent() {
    this.setState({
      visible: true
    });
  }

  getAllConsent(list) {
    const { allConsents } = this.state;
    if (allConsents.length > 0) {
      return;
    }
    let allConsentList = list.map((x) => {
      return {
        id: x.id,
        name: x.consentTitle
      };
    });
    this.setState({ allConsents: allConsentList });
  }

  updateTable(selectedRowKeys) {
    const { addField, form } = this.props;
    const { allConsents } = this.state;
    if (selectedRowKeys) {
      let consents = allConsents.filter((x) => selectedRowKeys.includes(x.id));
      addField('consents', consents);
      addField('consentIds', selectedRowKeys);
      form.setFieldsValue({
        consentIds: selectedRowKeys
      });
    }
    this.setState({
      visible: false
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { editable, subscriptionPlan, addField } = this.props;
    const { visible, allConsents } = this.state;
    return (
      <div>
        <h3>
          <FormattedMessage id="Subscription.Step3" />
        </h3>
        <h4>
          <FormattedMessage id="Subscription.EntryCriteria" />
        </h4>
        <div className="entryCriteria">
          <Form>
            <FormItem {...layout} label={<FormattedMessage id="Subscription.Subscription" />}>
              <Checkbox
                disabled={!editable}
                checked={subscriptionPlan.signOnSubscriptionFlag}
                onChange={(e) => {
                  subscriptionPlan.signOnSubscriptionFlag = e.target.checked;
                  addField('signOnSubscriptionFlag', subscriptionPlan.signOnSubscriptionFlag);
                }}
              >
                <span className="checkBoxTip">
                  <FormattedMessage id="Subscription.ConsumersNeed" />
                </span>
              </Checkbox>
            </FormItem>
            {subscriptionPlan.signOnSubscriptionFlag ? (
              <FormItem {...layout} label={<FormattedMessage id="Subscription.Consent" />}>
                <Row>
                  <Col span={16}>
                    {getFieldDecorator('consentIds', {
                      initialValue: subscriptionPlan.consentIds.map((cons) => parseInt(cons)),
                      rules: [{ required: true, message: <FormattedMessage id="PleaseAddConsent" /> }]
                    })(
                      <Select
                        disabled={!editable}
                        mode="multiple"
                        onChange={(value: any) => {
                          addField('consentIds', value);
                          let consents = allConsents.filter((x) => value.includes(x.id));
                          addField('consents', consents);
                        }}
                        dropdownStyle={{ display: 'none' }}
                      >
                        {allConsents.map((item, index) => (
                          <Option value={item.id} key={index}>
                            <Tooltip
                              overlayStyle={{
                                overflowY: 'auto'
                              }}
                              placement="bottomLeft"
                              title={<div dangerouslySetInnerHTML={{ __html: item.name }} />}
                            >
                              <div className="overflow" dangerouslySetInnerHTML={{ __html: item.name }} />
                            </Tooltip>
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Col>
                  <Col span={1}></Col>
                  <Col span={4}>
                    <Button type="primary" onClick={this.showAddConsent} disabled={!editable}>
                      <FormattedMessage id="Subscription.Add"/>
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            ) : null}

            <FormItem {...layout} label={<FormattedMessage id="Subscription.Subscription" />}>
              <Checkbox
                disabled={!editable}
                checked={subscriptionPlan.subscriptionPlanFlag}
                onChange={(e) => {
                  subscriptionPlan.subscriptionPlanFlag = e.target.checked;
                  addField('subscriptionPlanFlag', subscriptionPlan.subscriptionPlanFlag);
                }}
              >
                <span className="checkBoxTip">
                  <FormattedMessage id="Subscription.SubscriptionOtherPromotions" />
                </span>
              </Checkbox>
            </FormItem>
          </Form>
          <AddConsent getAllConsent={this.getAllConsent} visible={visible} updateTable={this.updateTable} selectedRowKeys={subscriptionPlan.consentIds} />
        </div>
      </div>
    );
  }
}
