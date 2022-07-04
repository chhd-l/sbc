import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, AuthWrapper, history, RCi18n } from 'qmkit';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Button, Form, Input, Row, Col, message, Select, Spin, Popconfirm, Switch, Breadcrumb, Card, Avatar, Pagination, Icon, DatePicker } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class AutomationForm extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      automationId: this.props.match.params.id ? this.props.match.params.id : '',
      title: this.props.match.params.id ? <FormattedMessage id="Marketing.AutomationEdit" /> : <FormattedMessage id="Marketing.NewAutomation" />,
      saveButtonText: this.props.match.params.id ? <FormattedMessage id="Marketing.SaveEditWorkflow" /> : <FormattedMessage id="Marketing.SaveNewWorkflow" />,
      loading: false,
      automationForm: {
        automationName: '',
        automationCategory: '',
        automationDescription: '',
        automationType: '',
        automationGoal: '',
        eventStartTime: '',
        eventEndTime: '',
        trackingStartTime: '',
        trackingEndTime: '',
        communicationChannel: '',
        workflow: null
      }
    };
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.getAutomationDetail(this.props.match.params.id);
    }
  }
  init = () => { };
  getAutomationDetail = (id) => {
    webapi
      .getAutomationById(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let automationForm = {
            automationName: res.context.name,
            automationCategory: res.context.category,
            automationDescription: res.context.description,
            automationType: res.context.type,
            automationGoal: res.context.goal,
            eventStartTime: res.context.eventStartTime,
            eventEndTime: res.context.eventEndTime,
            trackingStartTime: res.context.trackingStartTime,
            trackingEndTime: res.context.trackingEndTime,
            communicationChannel: res.context.communicationChannel ? res.context.communicationChannel.split(';') : '',
            workflow: res.context.workflow
          };
          this.setState({
            loading: false,
            automationForm
          });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const { automationForm, automationId } = this.state;
        let params = {
          tenantId: 0,
          name: automationForm.automationName,
          category: automationForm.automationCategory,
          description: automationForm.automationDescription,
          type: automationForm.automationType,
          goal: automationForm.automationGoal,
          eventStartTime: moment(automationForm.eventStartTime).format('YYYY-MM-DD HH:mm:ss'),
          eventEndTime: moment(automationForm.eventEndTime).format('YYYY-MM-DD HH:mm:ss'),
          trackingStartTime: moment(automationForm.trackingStartTime).format('YYYY-MM-DD HH:mm:ss'),
          trackingEndTime: moment(automationForm.trackingEndTime).format('YYYY-MM-DD HH:mm:ss'),
          communicationChannel: automationForm.communicationChannel ? automationForm.communicationChannel.join(';') : null,
          workflow: automationForm.workflow
        };
        if (new Date(params.eventStartTime) > new Date(params.trackingStartTime)) {
          return message.error(RCi18n({ id: 'Marketing.TSTNLTEST' }))
        }
        if (new Date(params.eventEndTime) > new Date(params.trackingEndTime)) {
          return message.error(RCi18n({ id: 'Marketing.TETNLTEET' }))
        }
        if (new Date(params.eventStartTime) > new Date(params.eventEndTime)) {
          return message.error(RCi18n({ id: 'Marketing.ENTNLTEST' }))
        }
        if (new Date(params.trackingStartTime) > new Date(params.trackingEndTime)) {
          return message.error(RCi18n({ id: 'Marketing.TETNLTTST' }))
        }
        if (automationId) {
          params = Object.assign(params, {
            id: automationId,
            deleteStatus: false
          });
          this.updateAutomation(params);
        } else {
          this.createAutomation(params);
        }
      }
    });
  };
  createAutomation = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .createAutomation(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || RCi18n({ id: 'Marketing.OperationSuccessful' }));
          history.push('/automation-workflow/' + res.context.id, { name: res.context.name });
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  updateAutomation = (params) => {
    this.setState({
      loading: true
    });
    webapi
      .updateAutomation(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          message.success(res.message || RCi18n({ id: 'Marketing.OperationSuccessful' }));
          history.push('/automation-workflow/' + res.context.id, { name: res.context.name });
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  onFormChange = ({ field, value }) => {
    let data = this.state.automationForm;
    data[field] = value;
    this.setState({
      automationForm: data
    });
  };

  disabledEventStartDate = (startValue) => {
    const { automationForm } = this.state;
    let endValue = automationForm.eventEndTime;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEventEndDate = (endValue) => {
    const { automationForm } = this.state;
    let startValue = automationForm.eventStartTime;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  disabledTrackingStartDate = (startValue) => {
    const { automationForm } = this.state;
    let endValue = automationForm.eventStartTime;
    // let eventStartValue = automationForm.eventStartTime
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf()
  };

  disabledTrackingEndDate = (endValue) => {
    const { automationForm } = this.state;
    let startValue = automationForm.eventEndTime;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  render() {
    const { loading, title, automationForm, saveButtonText } = this.state;

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
      { name: 'Repeat Purchase', value: 'Repeat Purchase' },
      { name: 'Subscriber Care', value: 'Subscriber Care' }
    ];
    const automationTypeList = [
      { name: 'Club Program', value: 'Club Program' },
      { name: 'Festival Greetings', value: 'Festival Greetings' },
      { name: 'Notification', value: 'Notification' },
      { name: 'Product Promotion', value: 'Product Promotion' },
      { name: 'Product Price Change EMAIL Notification', value: 'Product Price Change EMAIL Notification' }
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
          <Spin spinning={loading}>
            <BreadCrumb thirdLevel={true}>
              <Breadcrumb.Item>{title}</Breadcrumb.Item>
            </BreadCrumb>
            <div className="container">
              <Headline title={title} />
              <Form {...formItemLayout}>
                <Row gutter={16}>
                  <Col span={12}>
                    <FormItem label={<FormattedMessage id="Marketing.AutomationName" />}>
                      {getFieldDecorator('automationName', {
                        rules: [
                          {
                            required: true,
                            message: RCi18n({ id: 'Marketing.PleaseEnterAutomationName' }) + '!'
                          }
                        ],
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
                    <FormItem label={<FormattedMessage id="Marketing.AutomationCategory" />} >
                      {getFieldDecorator('automationCategory', {
                        initialValue: automationForm.automationCategory
                      })(
                        <Select
                          allowClear
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'automationCategory',
                              value: value
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
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label={<FormattedMessage id="Marketing.AutomationDescription" />} >
                      {getFieldDecorator('automationDescription', {
                        initialValue: automationForm.automationDescription
                      })(
                        <TextArea
                          style={{ width: '80%' }}
                          placeholder={RCi18n({ id: 'Marketing.PleaseInputAutomationDescription' })}
                          autoSize={{ minRows: 4, maxRows: 4 }}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onFormChange({
                              field: 'automationDescription',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label={<FormattedMessage id="Marketing.AutomationType" />} >
                      {getFieldDecorator('automationType', {
                        initialValue: automationForm.automationType
                      })(
                        <Select
                          allowClear
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'automationType',
                              value: value
                            });
                          }}
                        >
                          {automationTypeList
                            ? automationTypeList.map((item, index) => (
                              <Option value={item.value} key={index}>
                                {item.name}
                              </Option>
                            ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label={<FormattedMessage id="Marketing.AutomationGoal" />} >
                      {getFieldDecorator('automationGoal', {
                        initialValue: automationForm.automationGoal
                      })(
                        <Select
                          allowClear
                          style={{ width: '80%' }}
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'automationGoal',
                              value: value
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
                    <FormItem label={<FormattedMessage id="Marketing.EventStartTime" />} >
                      {getFieldDecorator('eventStartTime', {
                        rules: [{ required: true, message: RCi18n({ id: 'Marketing.PleaseSelectEventStartTime' }) + '!' }],
                        initialValue: automationForm.eventStartTime ? moment(new Date(automationForm.eventStartTime), 'YYYY-MM-DD HH:mm:ss') : null
                      })(
                        <DatePicker
                          disabledDate={this.disabledEventStartDate}
                          style={{ width: '80%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'eventStartTime',
                              value
                            });
                            this.onFormChange({
                              field: 'trackingStartTime',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label={<FormattedMessage id="Marketing.EventEndTime" />} >
                      {getFieldDecorator('eventEndTime', {
                        rules: [{ required: true, message: RCi18n({ id: 'Marketing.PleaseSelectEventEndTime' }) + '!' }],
                        initialValue: automationForm.eventEndTime ? moment(new Date(automationForm.eventEndTime), 'YYYY-MM-DD HH:mm:ss') : null
                      })(
                        <DatePicker
                          disabledDate={this.disabledEventEndDate}
                          style={{ width: '80%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'eventEndTime',
                              value
                            });
                            if (value) {
                              this.onFormChange({
                                field: 'trackingEndTime',
                                value: moment(value).add(3, 'days')
                              });
                            }

                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label={<FormattedMessage id="Marketing.TrackingStartTime" />}>
                      {getFieldDecorator('trackingStartTime', {
                        rules: [{ required: true, message: RCi18n({ id: 'Marketing.PleaseSelectTrackingStartTime' }) + '!' }],
                        initialValue: automationForm.trackingStartTime ? moment(new Date(automationForm.trackingStartTime), 'YYYY-MM-DD HH:mm:ss') : null
                      })(
                        <DatePicker
                          disabledDate={this.disabledTrackingStartDate}
                          style={{ width: '80%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'trackingStartTime',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label={<FormattedMessage id="Marketing.TrackingEndTime" />} >
                      {getFieldDecorator('trackingEndTime', {
                        rules: [{ required: true, message: RCi18n({ id: 'Marketing.PleaseSelectTrackingEndTime' }) + '!' }],
                        initialValue: automationForm.trackingEndTime ? moment(new Date(automationForm.trackingEndTime), 'YYYY-MM-DD HH:mm:ss') : null
                      })(
                        <DatePicker
                          disabledDate={this.disabledTrackingEndDate}
                          style={{ width: '80%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'trackingEndTime',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={12}>
                    <FormItem label={<FormattedMessage id="Marketing.CommunicationChannel" />}>
                      {getFieldDecorator('communicationChannel', {
                        initialValue: automationForm.communicationChannel ? automationForm.communicationChannel : []
                      })(
                        <Select
                          style={{ width: '80%' }}
                          mode="tags"
                          onChange={(value) => {
                            this.onFormChange({
                              field: 'communicationChannel',
                              value: value ? value : ''
                            });
                          }}
                        >
                          {communicationChannelList
                            ? communicationChannelList.map((item, index) => (
                              <Option value={item.value} key={index}>
                                {item.name}
                              </Option>
                            ))
                            : null}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </Spin>
        </div>
        <div className="bar-button">
          <Button type="primary" onClick={this.handleSubmit} loading={loading}>
            {saveButtonText}
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
