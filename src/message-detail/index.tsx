import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import {
  Icon,
  Table,
  Tooltip,
  Divider,
  Switch,
  Modal,
  Button,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb,
  Tag,
  message,
  Select,
  Radio,
  DatePicker,
  Spin
} from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

//数字数组
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
class MessageDetails extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title:
        this.props.location.pathname === '/message-quick-send'
          ? 'Quick Send'
          : 'Message Details',
      isDetail:
        this.props.location.pathname.indexOf('/message-detail') !== -1
          ? true
          : false,
      isEdit:
        this.props.location.pathname.indexOf('/message-edit') !== -1
          ? true
          : false,
      isAdd:
        this.props.location.pathname === '/message-quick-send' ? true : false,
      emailStatus: 'Draft',
      loading: false,
      objectTypeList: [],
      categoryList: [],
      basicForm: {
        taskId: '',
        emailCategory: '',
        templateId: '',
        emailTemplate: '',
        objectType: '',
        objectNo: '',
        status: 0,
        sendType: '',
        sendTime: '',
        objectNoDisable: true
      },
      detailForm: {
        consumerAccount: '',
        consumerName: '',
        consumerType: '',
        email: ''
      },
      detailsList: [],
      emailTemplateList: [],
      objectNoList: [],
      fetching: false,
      customerTypeArr: [
        {
          value: 'Member',
          name: 'Member',
          id: 234
        },
        {
          value: 'Guest',
          name: 'Guest',
          id: 233
        }
      ],
      previewHtml: '',
      consumerList: []
    };
  }
  componentDidMount() {
    this.querySysDictionary('objectType');
    this.querySysDictionary('messageCategory');
    this.initPage();
  }

  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({ type: type })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          if (type === 'objectType') {
            let objectTypeList = [...res.context.sysDictionaryVOS];
            this.setState({
              objectTypeList
            });
          }
          if (type === 'messageCategory') {
            let categoryList = [...res.context.sysDictionaryVOS];
            this.setState({
              categoryList
            });
          }
          if (type === 'messageStatus') {
            let statusList = [...res.context.sysDictionaryVOS];
            this.setState({
              statusList
            });
          }
        } else {
          message.error(res.message || 'Unsuccessful');
        }
      })
      .catch((err) => {
        message.error(err.message || 'Unsuccessful');
      });
  };

  initPage = () => {
    if (this.state.isAdd) {
      this.generateTaskId();
      this.getTemplateList();
    }
    if (this.state.isEdit) {
      this.findEmailTask();
      this.getTemplateList();
      this.getTaskDetail();
    }
    if (this.state.isDetail) {
      this.findEmailTask();
      this.getTaskDetail();
    }
  };

  onBasicFormFormChange = ({ field, value }) => {
    let data = this.state.basicForm;

    if (field === 'objectType' && data['objectType'] !== value) {
      // if (value === 'Order' || value === 'Subscription') {
      data['objectNoDisable'] = false;
      this.props.form.setFieldsValue({
        objectNo: ''
      });
      // } else {
      //   data['objectNoDisable'] = true;
      //   this.props.form.setFieldsValue({
      //     objectNo: ''
      //   });
      // }
    }
    if (field === 'sendType' && data['sendType'] !== value) {
      data['sendTime'] = '';
      this.props.form.setFieldsValue({
        sendTime: ''
      });
    }
    data[field] = value;
    this.setState({
      basicForm: data
    });
  };
  onDetailsFormChange = ({ field, value }) => {
    let data = this.state.detailForm;
    if (field === 'consumerType' && data['consumerType'] !== value) {
      data['consumerAccount'] = '';
      data['consumerName'] = '';
      data['email'] = '';
      this.props.form.setFieldsValue({
        consumerAccount: '',
        consumerName: '',
        email: ''
      });
    }
    data[field] = value;
    this.setState({
      detailForm: data
    });
  };

  generateTaskId = () => {
    webapi.generateTaskId().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        const { basicForm } = this.state;
        basicForm.taskId = res.context;
        this.setState(
          {
            basicForm: basicForm
          },
          () => {
            this.props.form.setFieldsValue({
              taskId: basicForm.taskId
            });
          }
        );
      }
    });
  };
  getTemplateList = () => {
    webapi.getTemplateList().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          emailTemplateList: res.context.emailTemplateResponseList
        });
      }
    });
  };
  findEmailTask = () => {
    webapi.findEmailTask(this.state.id).then((data) => {
      console.log(data);
    });
  };

  save = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        const { basicForm, detailForm } = this.state;
        let params = {
          id: this.state.id,
          taskId: basicForm.taskId,
          objectType: basicForm.objectType,
          objectNo: basicForm.objectNo,
          templateId: basicForm.templateId,
          emailTemplate: basicForm.emailTemplate,
          category: basicForm.emailCategory,
          status: +basicForm.status === 1 ? basicForm.status : 0,
          sendType: basicForm.sendType,
          sendTime:
            basicForm.sendTime ||
            sessionStorage.getItem('defaultLocalDateTime'),
          detailsRequest: {
            consumerAccount: detailForm.consumerAccount,
            consumerName: detailForm.consumerName,
            consumerType: detailForm.consumerType,
            email: detailForm.email
          }
        };
        if (params.id) {
          this.updateEmailTask(params, 'save');
        } else {
          this.addEmailTask(params, 'save');
        }
      }
    });
  };
  submit = () => {
    this.props.form.validateFields((err) => {
      if (!err) {
        const { basicForm, detailForm } = this.state;

        let params = {
          id: this.state.id,
          taskId: basicForm.taskId,
          objectType: basicForm.objectType,
          objectNo: basicForm.objectNo,
          templateId: basicForm.templateId,
          emailTemplate: basicForm.emailTemplate,
          category: basicForm.emailCategory,
          sendType: basicForm.sendType,
          sendTime:
            basicForm.sendTime ||
            sessionStorage.getItem('defaultLocalDateTime'),
          status: 1,
          detailsRequest: {
            consumerAccount: detailForm.consumerAccount,
            consumerName: detailForm.consumerName,
            consumerType: detailForm.consumerType,
            email: detailForm.email
          }
        };
        if (params.id) {
          this.updateEmailTask(params, 'submit');
        } else {
          this.addEmailTask(params, 'submit');
        }
      }
    });
  };
  addEmailTask = (params, type) => {
    this.setState({
      loading: true
    });
    webapi
      .addEmailTask(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'submit') {
            history.push({
              pathname: '/message-email'
            });
          }
          this.setState({
            loading: false,
            previewHtml: res.context.emailTemplateHtml
          });
        } else {
          message.error(res.message || type + ' Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || type + ' Failed');
        this.setState({
          loading: false
        });
      });
  };
  updateEmailTask = (params, type) => {
    this.setState({
      loading: true
    });
    webapi
      .updateEmailTask(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          if (type === 'submit') {
            history.push({
              pathname: '/message-email'
            });
          }
          this.setState({
            loading: false,
            previewHtml: res.context.emailTemplateHtml
          });
        } else {
          message.error(res.message || type + ' Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || type + ' Failed');
        this.setState({
          loading: false
        });
      });
  };
  getObjectNoList = (value) => {
    const { basicForm } = this.state;
    this.setState({
      fetching: true
    });
    if (basicForm.objectType === 'Order') {
      let params = {
        id: value,
        pageSize: 30,
        pageNum: 0
      };
      webapi.getOrderList(params).then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          console.log(res);

          this.setState({
            objectNoList: res.context.content,
            fetching: false
          });
        }
      });
    } else if (basicForm.objectType === 'Subscription') {
      let params = {
        subscribeId: value,
        pageSize: 30,
        pageNum: 0
      };
      webapi.getSubscriptionList(params).then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            objectNoList: res.context.subscriptionResponses,
            fetching: false
          });
        }
      });
    } else if (basicForm.objectType === 'Recommendation') {
      let params = {
        recommendationId: value,
        pageSize: 30,
        pageNum: 0
      };
      webapi.getRecommendationList(params).then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            objectNoList: res.context.recommendations,
            fetching: false
          });
        }
      });
    }
  };
  getTaskDetail = () => {
    webapi.findEmailTask(this.state.id).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let taskDetail = res.context;
        let consumerDetail = taskDetail.detailsResponse;
        let basicForm = {
          taskId: taskDetail.taskId,
          emailCategory: taskDetail.category,
          templateId: taskDetail.templateId,
          emailTemplate: taskDetail.emailTemplate,
          objectType: taskDetail.objectType,
          objectNo: taskDetail.objectNo,
          status: taskDetail.status,
          sendType: taskDetail.sendType,
          sendTime: taskDetail.sendTime,
          objectNoDisable:
            taskDetail.objectType === 'Order' ||
            taskDetail.objectType === 'Subscription'
              ? false
              : true
        };
        let detailForm = {
          consumerAccount: consumerDetail.consumerAccount,
          consumerName: consumerDetail.consumerName,
          consumerType: consumerDetail.consumerType,
          email: consumerDetail.email
        };
        this.setState(
          {
            basicForm,
            detailForm,
            previewHtml: taskDetail.emailTemplateHtml,
            emailStatus:
              +taskDetail.status === 0
                ? 'Draft'
                : +taskDetail.status === 1
                ? 'To do'
                : +taskDetail.status === 2
                ? 'Finsh'
                : ''
          },
          () => {
            if (basicForm.sendType === 'Timing') {
              this.props.form.setFieldsValue({
                taskId: basicForm.taskId,
                emailCategory: basicForm.emailCategory,
                templateId: basicForm.templateId,
                objectType: basicForm.objectType,
                objectNo: basicForm.objectNo,
                sendType: basicForm.sendType,
                sendTime: moment(basicForm.sendTime),
                consumerAccount: detailForm.consumerAccount,
                consumerName: detailForm.consumerName,
                consumerType: detailForm.consumerType,
                email: detailForm.email
              });
            } else {
              this.props.form.setFieldsValue({
                taskId: basicForm.taskId,
                emailCategory: basicForm.emailCategory,
                templateId: basicForm.templateId,
                objectType: basicForm.objectType,
                objectNo: basicForm.objectNo,
                sendType: basicForm.sendType,
                consumerAccount: detailForm.consumerAccount,
                consumerName: detailForm.consumerName,
                consumerType: detailForm.consumerType,
                email: detailForm.email
              });
            }
          }
        );
      }
    });
  };

  //限制日期
  disabledDate(current) {
    return (
      current &&
      moment(current).startOf('day') <
        moment(sessionStorage.getItem('defaultLocalDateTime')).startOf('day')
    );
  }
  //限制时间
  disabledDateTime(data) {
    console.log(moment(data).format('YYYY-MM-DD HH:mm:ss'));

    return {
      disabledHours: () => {
        let currentDay = moment(
          sessionStorage.getItem('defaultLocalDateTime')
        ).date();
        let currentHours = moment(
          sessionStorage.getItem('defaultLocalDateTime')
        ).hours();
        let selectedDay = moment(data).date();
        console.log(currentDay, currentHours, selectedDay);
        if (selectedDay > currentDay) {
          return [];
        } else {
          return range(0, currentHours + 1);
        }
      }
    };
  }
  getConsumerList = (value) => {
    let params = {
      customerAccount: value,
      pageSize: 30,
      pageNum: 0
    };
    webapi.getConsumerList(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          consumerList: res.context.detailResponseList,
          fetching: false
        });
      }
    });
  };

  render() {
    const {
      title,
      emailStatus,
      objectTypeList,
      categoryList,
      detailsList,
      emailTemplateList,
      basicForm,
      detailForm,
      fetching,
      objectNoList,
      customerTypeArr,
      previewHtml,
      consumerList
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: 'Consumer Account',
        dataIndex: 'consumerAccount',
        key: 'consumerAccount',
        width: '15%'
      },
      {
        title: 'Consumer Name',
        dataIndex: 'consumerName',
        key: 'consumerName',
        width: '15%'
      },
      {
        title: 'Consumer Type',
        dataIndex: 'consumerType',
        key: 'consumerType',
        width: '15%'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '15%'
      },
      {
        title: 'Sent Time',
        dataIndex: 'sentTime',
        key: 'sentTime',
        width: '15%'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%'
      },
      {
        title: 'Requests Time',
        dataIndex: 'requestsTime',
        key: 'requestsTime',
        width: '15%'
      }
    ];

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Message Details</Breadcrumb.Item>
        </BreadCrumb>
        {/*导航面包屑*/}
        <Spin spinning={this.state.loading}>
          <div className="container-search">
            <Headline title={title} />

            <div>
              <div style={styles.title}>
                <span style={styles.titleText}>Basic Information</span>
                {emailStatus === 'Draft' ? <Tag>{emailStatus}</Tag> : null}
                {emailStatus === 'Finish' ? (
                  <Tag color="#87d068">{emailStatus}</Tag>
                ) : null}
                {emailStatus === 'To do' ? (
                  <Tag color="#108ee9">{emailStatus}</Tag>
                ) : null}
              </div>
              <Form
                layout="horizontal"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                labelAlign="right"
              >
                <Row style={{ marginTop: 20 }}>
                  <Col span={8}>
                    <FormItem label="Task ID">
                      {getFieldDecorator('taskId', {
                        rules: [{ required: true }]
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Email Category">
                      {getFieldDecorator('emailCategory', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Email Category!'
                          }
                        ]
                      })(
                        <Select
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onBasicFormFormChange({
                              field: 'emailCategory',
                              value
                            });
                          }}
                          disabled={this.state.isDetail}
                        >
                          {categoryList &&
                            categoryList.map((item, index) => (
                              <Option value={item.name} key={index}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Email Template">
                      {getFieldDecorator('templateId', {
                        rules: [
                          {
                            required: true,
                            message: 'Please select Email Template!'
                          }
                        ]
                      })(
                        <Select
                          onChange={(value, option) => {
                            let name = option.props.children;
                            value = value === '' ? null : value;
                            this.onBasicFormFormChange({
                              field: 'emailTemplate',
                              value: name
                            });
                            this.onBasicFormFormChange({
                              field: 'templateId',
                              value
                            });
                          }}
                          disabled={this.state.isDetail}
                        >
                          {emailTemplateList &&
                            emailTemplateList.map((item, index) => (
                              <Option value={item.templateId} key={index}>
                                {item.emailTemplate}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Object Type">
                      {getFieldDecorator('objectType', {
                        rules: [
                          {
                            required: true,
                            message: 'Please Select Object Type!'
                          }
                        ]
                      })(
                        <Select
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onBasicFormFormChange({
                              field: 'objectType',
                              value
                            });
                          }}
                          disabled={this.state.isDetail}
                        >
                          {objectTypeList &&
                            objectTypeList.map((item, index) => (
                              <Option value={item.name} key={index}>
                                {item.name}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Object No">
                      {getFieldDecorator('objectNo', {
                        rules: [
                          {
                            max: 50,
                            message: 'Object No exceed the maximum length!'
                          }
                        ]
                      })(
                        <Select
                          disabled={
                            basicForm.objectNoDisable || this.state.isDetail
                          }
                          showSearch
                          placeholder="Select a Object No"
                          optionFilterProp="children"
                          onChange={(value) => {
                            this.onBasicFormFormChange({
                              field: 'objectNo',
                              value
                            });
                          }}
                          notFoundContent={
                            fetching ? <Spin size="small" /> : null
                          }
                          onSearch={this.getObjectNoList}
                          filterOption={(input, option) =>
                            option.props.children
                              .toString()
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {objectNoList &&
                            objectNoList.map((item, index) => (
                              <Option
                                value={
                                  item.recommendationId ||
                                  item.subscribeId ||
                                  item.id
                                }
                                key={index}
                              >
                                {item.subscribeId ||
                                  item.recommendationId ||
                                  item.id}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem label="Send Time">
                      {getFieldDecorator('sendType', {
                        rules: [
                          {
                            required: true,
                            message: 'Please select Send Time!'
                          }
                        ]
                      })(
                        <Radio.Group
                          disabled={this.state.isDetail}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onBasicFormFormChange({
                              field: 'sendType',
                              value
                            });
                          }}
                        >
                          <Radio value="Immediately">Immediately</Radio>
                          <Radio value="Timing">Timing</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                  {basicForm.sendType === 'Timing' ? (
                    <Col span={8}>
                      <FormItem label="Select Time">
                        {getFieldDecorator('sendTime', {
                          rules: [
                            { required: true, message: 'Please select Time!' }
                          ]
                        })(
                          <DatePicker
                            showTime
                            disabledDate={this.disabledDate}
                            disabledTime={this.disabledDateTime}
                            placeholder="Select Time"
                            style={{ width: '100%' }}
                            disabled={this.state.isDetail}
                            onChange={(value, dateString) => {
                              this.onBasicFormFormChange({
                                field: 'sendTime',
                                value: dateString
                              });
                            }}
                          />
                        )}
                      </FormItem>
                    </Col>
                  ) : null}
                </Row>
              </Form>
            </div>

            {/* {this.state.isDetail ?
            <div>
              <div style={styles.title}>
                <span style={styles.titleText}>Recipient details</span>
              </div>
              <Table
                style={{ marginTop: 20 }}
                columns={columns}
                dataSource={detailsList}
                pagination={false}
              />
            </div>
            : */}
            <div>
              <div style={styles.title}>
                <span style={styles.titleText}>Recipient details</span>
              </div>

              <Form
                layout="horizontal"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                labelAlign="right"
              >
                <Row style={{ marginTop: 20 }}>
                  <Col span={8}>
                    <FormItem label="Consumer Type">
                      {getFieldDecorator('consumerType', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Consumer Type!'
                          }
                        ]
                      })(
                        <Select
                          disabled={this.state.isDetail}
                          onChange={(value) => {
                            value = value === '' ? null : value;
                            this.onDetailsFormChange({
                              field: 'consumerType',
                              value
                            });
                          }}
                        >
                          {customerTypeArr.map((item) => (
                            <Option value={item.value} key={item.id}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Consumer Account">
                      {getFieldDecorator(
                        'consumerAccount',
                        {}
                      )(
                        <Select
                          disabled={
                            detailForm.consumerType !== 'Member' ||
                            this.state.isDetail
                          }
                          showSearch
                          placeholder="Select a consumer"
                          optionFilterProp="children"
                          onChange={(value, option) => {
                            let consumer = option.props['data-consumer'];
                            let consumerName = consumer.customerName;
                            let email = consumer.email;
                            this.onDetailsFormChange({
                              field: 'consumerAccount',
                              value
                            });
                            this.onDetailsFormChange({
                              field: 'consumerName',
                              value: consumerName
                            });
                            this.onDetailsFormChange({
                              field: 'email',
                              value: email
                            });
                            this.props.form.setFieldsValue({
                              consumerName: consumerName,
                              email: email
                            });
                          }}
                          notFoundContent={
                            fetching ? <Spin size="small" /> : null
                          }
                          onSearch={this.getConsumerList}
                          filterOption={(input, option) =>
                            option.props.children
                              .toString()
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {consumerList &&
                            consumerList.map((item, index) => (
                              <Option
                                value={item.customerAccount}
                                data-consumer={item}
                                key={index}
                              >
                                {item.customerAccount}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Consumer Name">
                      {getFieldDecorator('consumerName', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Consumer Name!'
                          },
                          {
                            max: 50,
                            message: 'Consumer Name exceed the maximum length!'
                          }
                        ]
                      })(
                        <Input
                          disabled={
                            detailForm.consumerType === 'Member' ||
                            this.state.isDetail
                          }
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onDetailsFormChange({
                              field: 'consumerName',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem label="Email">
                      {getFieldDecorator('email', {
                        rules: [
                          { required: true, message: 'Please input Email!' },
                          {
                            max: 50,
                            message: 'Email exceed the maximum length!'
                          }
                        ]
                      })(
                        <Input
                          disabled={
                            detailForm.consumerType === 'Member' ||
                            this.state.isDetail
                          }
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onDetailsFormChange({
                              field: 'email',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
            {/* } */}
            {previewHtml ? (
              <div>
                <div style={styles.title}>
                  <span style={styles.titleText}>Preview</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: previewHtml }}></div>
              </div>
            ) : null}
          </div>
        </Spin>

        <div className="bar-button">
          {!this.state.isDetail ? (
            <Button
              type="primary"
              shape="round"
              onClick={() => this.submit()}
              style={{ marginRight: 10 }}
            >
              Submit
            </Button>
          ) : null}
          {!this.state.isDetail ? (
            <Button
              type="primary"
              shape="round"
              style={{ marginRight: 10 }}
              onClick={() => this.save()}
            >
              {<FormattedMessage id="save" />}
            </Button>
          ) : null}

          <Button
            shape="round"
            onClick={() => (history as any).go(-1)}
            style={{ marginRight: 10 }}
          >
            {<FormattedMessage id="cancel" />}
          </Button>
        </div>
      </div>
    );
  }
}
const styles = {
  title: {
    borderBottom: 'solid 1px #cccccc',
    paddingBottom: 10
  },
  titleText: {
    color: '#e2001a',
    marginRight: 10,
    fontWeigh: 500
  },
  label: {
    width: 100
  },
  warpper: {}
} as any;

export default Form.create()(MessageDetails);
