import React, { Component } from 'react';
import { Form, Input, Checkbox, Row, Col, Select, Button, Tooltip } from 'antd';
import AddConsent from '../modals/addConsent';

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
      addField('consentTypes', consents);
      addField('consentTypeIds', selectedRowKeys);
      form.setFieldsValue({
        consentTypeIds: selectedRowKeys
      });
    }
    this.setState({
      visible: false
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { subscriptionPlan, addField } = this.props;
    const { visible, allConsents } = this.state;
    return (
      <div>
        <h3>Step3</h3>
        <h4>Entry Criteria</h4>
        <div className="entryCriteria">
          <Form>
            <FormItem {...layout} label="Subscription Plan name">
              <Checkbox
                checked={subscriptionPlan.signOnSubscription === 1 ? true : false}
                onChange={(e) => {
                  subscriptionPlan.signOnSubscription = e.target.checked ? 1 : 0;
                  addField('signOnSubscription', subscriptionPlan.signOnSubscription);
                }}
              >
                <span className="checkBoxTip">Consumers need consent to sign on subscription</span>
              </Checkbox>
            </FormItem>
            {subscriptionPlan.signOnSubscription === 1 ? (
              <FormItem {...layout} label="Consent">
                <Row>
                  <Col span={16}>
                    {getFieldDecorator('consentTypeIds', {
                      initialValue: subscriptionPlan.consentTypeIds,
                      rules: [{ required: true, message: 'Please add Consent' }]
                    })(
                      <Select
                        mode="multiple"
                        onChange={(value: any) => {
                          addField('consentTypeIds', value);
                          let consents = allConsents.filter((x) => value.includes(x.id));
                          addField('consentTypes', consents);
                        }}
                        dropdownStyle={{display: 'none'}}
                      >
                        {subscriptionPlan.consentTypes &&
                          subscriptionPlan.consentTypes.map((item, index) => (
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
                    <Button type="primary" onClick={this.showAddConsent}>
                      Add
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            ) : null}

            <FormItem {...layout} label="Subscription Plan">
              <Checkbox
                checked={subscriptionPlan.otherPromotion === 1 ? true : false}
                onChange={(e) => {
                  subscriptionPlan.otherPromotion = e.target.checked ? 1 : 0;
                  addField('otherPromotion', subscriptionPlan.otherPromotion);
                }}
              >
                <span className="checkBoxTip">Subscription plan can be applied with other promotions</span>
              </Checkbox>
            </FormItem>
          </Form>
          <AddConsent getAllConsent={this.getAllConsent} visible={visible} updateTable={this.updateTable} selectedRowKeys={subscriptionPlan.consentTypeIds} />
        </div>
      </div>
    );
  }
}
