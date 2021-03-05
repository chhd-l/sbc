import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, DatePicker } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

class AutomationForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      automationId: this.props.match.params.id ? this.props.match.params.id : '',
      title: this.props.match.params.id ? 'Automation edit' : 'New Automation',
      loading: false,
      automationForm: {
        automationName: '',
        automationCategory: '',
        automationType: '',
        automationGoal: '',
        eventStartTime: '',
        eventEndTime: '',
        trackingStartTime: '',
        trackingEndTime: '',
        communicationChannel: ''
      }
    };
  }
  componentDidMount() {}
  init = () => {};
  getAutomationDetail = () => {};
  handleSubmit = () => {};
  onFormChange = ({ field, value }) => {
    let data = this.state.searchForm;
    data[field] = value;
    this.setState({
      searchForm: data
    });
  };

  render() {
    const { loading, title, automationForm } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const { getFieldDecorator } = this.props.form;

    const automationCategoryList = [
      { name: 'Club Member Care', value: 'Club Member Care' },
      { name: 'Commercial Activity', value: 'Commercial Activity' },
      { name: 'Repeat Purchase', value: 'Repeat Purchase' }
    ];
    const automationTypeList = [
      { name: 'Club Program', value: 'Club Program' },
      { name: 'Festival Greetings', value: 'Festival Greetings' },
      { name: 'Notification', value: 'Notification' },
      { name: 'Product Promotion', value: 'Product Promotion' }
    ];
    const automationGoalList = [
      { name: 'New Repeat', value: 'New Repeat' },
      { name: 'Recruitment', value: 'Recruitment' },
      { name: 'Retention', value: 'Retention' }
    ];
    const communicationChannelList = [
      { name: 'Email', value: 'Email' },
      { name: 'Phone call', value: 'Phone call' }
    ];

    return (
      <AuthWrapper functionName="f_automation_form">
        <div>
          <Spin spinning={loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container">
              <Headline title={title} />
              <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem label="Automation name">
                      {getFieldDecorator('automationName', {
                        initialValue: automationForm.automationName
                      })(
                        <Input
                          style={{ width: '80%' }}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'automationName',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label="Automation category">
                      {getFieldDecorator('automationCategory', {
                        initialValue: automationForm.automationCategory
                      })(
                        <Select
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'automationCategory',
                              value: value ? value : ''
                            });
                          }}
                        >
                          {automationCategoryList
                            ? automationCategoryList.map((item, index) => (
                                <Option value={item.value} key={index}>
                                  {item.name}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label="Automation goal">
                      {getFieldDecorator('automationGoal', {
                        initialValue: automationForm.automationGoal
                      })(
                        <Select
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'automationGoal',
                              value: value ? value : ''
                            });
                          }}
                        >
                          {automationGoalList
                            ? automationGoalList.map((item, index) => (
                                <Option value={item.value} key={index}>
                                  {item.name}
                                </Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label="Automation category">
                      {getFieldDecorator('automationCategory', {
                        initialValue: automationForm.automationCategory
                      })(
                        <Input
                          style={{ width: '80%' }}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'automationCategory',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem label="Automation Description">
                      {getFieldDecorator('createTime', {
                        initialValue: moment(this.state.basicForm.createTime)
                      })(<DatePicker style={{ width: '80%' }} format="YYYY-MM-DD HH:mm:ss" disabled={true} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </Spin>
        </div>
        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => {
              console.log('save');
            }}
          >
            {<FormattedMessage id="save" />}
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={() => (history as any).go(-1)}>
            {<FormattedMessage id="back" />}
          </Button>
        </div>
      </AuthWrapper>
    );
  }
}

export default Form.create()(AutomationForm);
