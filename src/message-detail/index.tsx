import React, { Component } from 'react';
import { BreadCrumb, Headline, Const, history } from 'qmkit';
import { Icon, Table, Tooltip, Divider, Switch, Modal, Button, Form, Input, Row, Col, Breadcrumb, Tag, message, Select, Radio, DatePicker, Spin } from 'antd';

import * as webapi from './webapi';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import _ from 'lodash';

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
      title: this.props.location.pathname === '/message-quick-send' ? 'Quick Send' : 'Message Details',
      isDetail: this.props.location.pathname.indexOf('/message-detail') !== -1 ? true : false,
      isEdit: this.props.location.pathname.indexOf('/message-edit') !== -1 ? true : false,
      isAdd: this.props.location.pathname === '/message-quick-send' ? true : false,
      emailStatus: 'Draft',
      loading: false,
      // objectTypeList: [],
      // categoryList: [],
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
        objectNoDisable: true,
        baseUrl: location.host
      },
      detailForm: {
        consumerAccount: '',
        consumerName: '',
        consumerType: '',
        email: '',
        petId: '',
        petName: '',
        ccList: ''
      },
      emailTemplateList: [],
      objectNoList: [],
      objectFetching: false,
      templateFetching: false,
      consumerFetching: false,
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
      consumerList: [],
      petList: []
    };
  }
  componentDidMount() {
    // this.querySysDictionary('objectType');
    // this.querySysDictionary('messageCategory');
    this.initPage();
  }

  // querySysDictionary = (type: String) => {
  //   webapi
  //     .querySysDictionary({ type: type })
  //     .then((data) => {
  //       const { res } = data;
  //       if (res.code === Const.SUCCESS_CODE) {
  //         if (type === 'objectType') {
  //           let objectTypeList = [...res.context.sysDictionaryVOS];
  //           this.setState({
  //             objectTypeList
  //           });
  //         }
  //         if (type === 'messageCategory') {
  //           let categoryList = [...res.context.sysDictionaryVOS];
  //           this.setState({
  //             categoryList
  //           });
  //         }
  //         if (type === 'messageStatus') {
  //           let statusList = [...res.context.sysDictionaryVOS];
  //           this.setState({
  //             statusList
  //           });
  //         }
  //       } else {
  //       }
  //     })
  //     .catch((err) => {});
  // };

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

  onBasicFormChange = ({ field, value }) => {
    let data = this.state.basicForm;

    if (field === 'objectType' && data['objectType'] !== value) {
      // if (value === 'Order' || value === 'Subscription' || value === 'Recommendation' ) {
      data['objectNoDisable'] = false;
      data['objectNo'] = '';
      this.setState({
        objectNoList: []
      });
      this.props.form.setFieldsValue({
        objectNo: '',
        objectNoList: []
      });
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
      data['relatedPet'] = '';
      this.props.form.setFieldsValue({
        consumerAccount: '',
        consumerName: '',
        email: '',
        relatedPet: ''
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
    this.setState({
      templateFetching: true
    });
    webapi.getTemplateList().then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          emailTemplateList: res.context.emailTemplateResponseList,
          templateFetching: false
        });
      }
    });
  };
  findEmailTask = () => {
    webapi.findEmailTask(this.state.id).then((data) => {});
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
          baseUrl: basicForm.baseUrl,
          sendTime: basicForm.sendTime || sessionStorage.getItem('defaultLocalDateTime'),
          detailsRequest: {
            consumerAccount: detailForm.consumerAccount,
            consumerName: detailForm.consumerName,
            consumerType: detailForm.consumerType,
            email: detailForm.email,
            petId: detailForm.petId,
            petName: detailForm.petName,
            ccList: detailForm.ccList
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
          baseUrl: basicForm.baseUrl,
          templateId: basicForm.templateId,
          emailTemplate: basicForm.emailTemplate,
          category: basicForm.emailCategory,
          sendType: basicForm.sendType,
          sendTime: basicForm.sendTime || sessionStorage.getItem('defaultLocalDateTime'),
          status: 1,
          detailsRequest: {
            consumerAccount: detailForm.consumerAccount,
            consumerName: detailForm.consumerName,
            consumerType: detailForm.consumerType,
            email: detailForm.email,
            petId: detailForm.petId,
            petName: detailForm.petName,
            ccList: detailForm.ccList
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
            id:res.context.id,
            previewHtml: res.context.emailTemplateHtml
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
  getObjectNoList = (value) => {
    const { basicForm } = this.state;
    this.setState({
      objectFetching: true
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
          this.setState({
            objectNoList: res.context.content,
            objectFetching: false
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
            objectFetching: false
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
            objectFetching: false
          });
        }
      });
    } else if (basicForm.objectType === 'Prescriber creation') {
      let params = {
        prescriberId: value,
        pageSize: 30,
        pageNum: 0
      };
      webapi.getClinicList(params).then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            objectNoList: res.context.content,
            objectFetching: false
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
          objectNoDisable: taskDetail.objectType === 'Order' || taskDetail.objectType === 'Subscription' ? false : true
        };
        let detailForm = {
          consumerAccount: consumerDetail.consumerAccount,
          consumerName: consumerDetail.consumerName,
          consumerType: consumerDetail.consumerType,
          email: consumerDetail.email,
          ccList: consumerDetail.ccList,
          petId: consumerDetail.petId,
          petName: consumerDetail.petName
        };
        if (consumerDetail.consumerAccount) {
          this.getPetList(consumerDetail.consumerAccount);
        }
        this.setState(
          {
            basicForm,
            detailForm,
            previewHtml: taskDetail.emailTemplateHtml,
            emailStatus: +taskDetail.status === 0 ? 'Draft' : +taskDetail.status === 1 ? 'To do' : +taskDetail.status === 2 ? 'Finsh' : ''
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
                email: detailForm.email,
                ccList: detailForm.ccList,
                pet: detailForm.petId
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
                email: detailForm.email,
                ccList: detailForm.ccList,
                pet: detailForm.petId
              });
            }
          }
        );
      }
    });
  };

  //限制日期
  disabledDate(current) {
    return current && moment(current).startOf('day') < moment(sessionStorage.getItem('defaultLocalDateTime')).startOf('day');
  }
  //限制时间
  disabledDateTime(data) {
    return {
      disabledHours: () => {
        let currentDay = moment(sessionStorage.getItem('defaultLocalDateTime')).date();
        let currentHours = moment(sessionStorage.getItem('defaultLocalDateTime')).hours();
        let selectedDay = moment(data).date();
        if (selectedDay > currentDay) {
          return [];
        } else {
          return range(0, currentHours + 1);
        }
      }
    };
  }
  getConsumerList = (value) => {
    this.setState({
      consumerFetching: true
    });
    let params = {
      customerAccount: value,
      customerLevelId: 234,
      pageSize: 30,
      pageNum: 0
    };
    webapi.getConsumerList(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          consumerList: res.context.detailResponseList,
          consumerFetching: false
        });
      }
    });
  };
  getPetList = (value) => {
    let params = {
      consumerAccount: value
    };
    webapi.petsByConsumer(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        this.setState({
          petList: res.context.context
        });
      }
    });
  };

  render() {
    const { title, emailStatus, emailTemplateList, basicForm, detailForm, objectFetching, consumerFetching, templateFetching, objectNoList, customerTypeArr, previewHtml, consumerList, petList } = this.state;
    const { getFieldDecorator } = this.props.form;

    const objectTypeList = [
      {
        value: 'Order',
        name: 'Order'
      },
      {
        value: 'Subscription',
        name: 'Subscription'
      },
      {
        value: 'Recommendation',
        name: 'Recommendation'
      },
      {
        value: 'Prescriber creation',
        name: 'Prescriber creation'
      }
    ];
    const categoryList = [
      {
        value: 'Notification',
        name: 'Notification'
      }
    ];

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>Message Details</Breadcrumb.Item>
        </BreadCrumb>
        {/*导航面包屑*/}
        <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
          <div className="container-search">
            <Headline title={title} />

            <div>
              <div style={styles.title}>
                <span style={styles.titleText}>Basic Information</span>
                {emailStatus === 'Draft' ? <Tag>{emailStatus}</Tag> : null}
                {emailStatus === 'Finish' ? <Tag color="#87d068">{emailStatus}</Tag> : null}
                {emailStatus === 'To do' ? <Tag color="#108ee9">{emailStatus}</Tag> : null}
              </div>
              <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} labelAlign="right">
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
                            this.onBasicFormChange({
                              field: 'emailCategory',
                              value
                            });
                          }}
                          disabled={this.state.isDetail}
                          getPopupContainer={(trigger: any) => trigger.parentNode}
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
                          onChange={(value, option: any) => {
                            let name = option.props.children;
                            value = value === '' ? null : value;
                            this.onBasicFormChange({
                              field: 'emailTemplate',
                              value: name
                            });
                            this.onBasicFormChange({
                              field: 'templateId',
                              value
                            });
                          }}
                          notFoundContent={templateFetching ? <Spin size="small" /> : null}
                          getPopupContainer={(trigger: any) => trigger.parentNode}
                          disabled={this.state.isDetail}
                        >
                          {emailTemplateList &&
                            emailTemplateList.map((item, index) => (
                              <Option title={item.emailTemplate && item.emailTemplate.length > 15 ? item.emailTemplate : ''} value={item.templateId} key={index}>
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
                            this.onBasicFormChange({
                              field: 'objectType',
                              value
                            });
                          }}
                          disabled={this.state.isDetail}
                          getPopupContainer={(trigger: any) => trigger.parentNode}
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
                            required: true,
                            message: 'Please Select Object No!'
                          },
                          {
                            max: 50,
                            message: 'Object No exceed the maximum length!'
                          }
                        ]
                      })(
                        <Select
                          disabled={basicForm.objectNoDisable || this.state.isDetail}
                          showSearch
                          placeholder="Select a Object No"
                          optionFilterProp="children"
                          getPopupContainer={(trigger: any) => trigger.parentNode}
                          onChange={(value) => {
                            this.onBasicFormChange({
                              field: 'objectNo',
                              value
                            });
                          }}
                          notFoundContent={objectFetching ? <Spin size="small" /> : null}
                          onSearch={_.debounce(this.getObjectNoList, 500)}
                          filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {objectNoList &&
                            objectNoList.map((item, index) => (
                              <Option value={basicForm.objectType === 'Order' ? item.id : basicForm.objectType === 'Subscription' ? item.subscribeId : basicForm.objectType === 'Recommendation' ? item.recommendationId : item.prescriberId} key={index}>
                                {basicForm.objectType === 'Order' ? item.id : basicForm.objectType === 'Subscription' ? item.subscribeId : basicForm.objectType === 'Recommendation' ? item.recommendationId : item.prescriberId + '-' + item.prescriberName}
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
                            this.onBasicFormChange({
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
                          rules: [{ required: true, message: 'Please select Time!' }]
                        })(
                          <DatePicker
                            showTime
                            disabledDate={this.disabledDate}
                            disabledTime={this.disabledDateTime}
                            placeholder="Select Time"
                            style={{ width: '100%' }}
                            disabled={this.state.isDetail}
                            onChange={(value, dateString) => {
                              this.onBasicFormChange({
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

            <div>
              <div style={styles.title}>
                <span style={styles.titleText}>Recipient details</span>
              </div>

              <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} labelAlign="right">
                <Row style={{ marginTop: 20 }}>
                  <Col span={8}>
                    <FormItem label="Pet Owner Type">
                      {getFieldDecorator('consumerType', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Pet Owner Type!'
                          }
                        ]
                      })(
                        <Select
                          disabled={this.state.isDetail}
                          getPopupContainer={(trigger: any) => trigger.parentNode}
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
                    <FormItem label="Pet Owner Account">
                      {getFieldDecorator(
                        'consumerAccount',
                        {}
                      )(
                        <Select
                          disabled={detailForm.consumerType !== 'Member' || this.state.isDetail}
                          getPopupContainer={(trigger: any) => trigger.parentNode}
                          showSearch
                          placeholder="Select a consumer"
                          optionFilterProp="children"
                          onChange={(value, option: any) => {
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
                            this.getPetList(value);
                          }}
                          notFoundContent={consumerFetching ? <Spin size="small" /> : null}
                          onSearch={_.debounce(this.getConsumerList, 500)}
                          filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {consumerList &&
                            consumerList.map((item, index) => (
                              <Option value={item.customerAccount} data-consumer={item} key={index}>
                                {item.customerAccount}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem label="Pet Owner Name">
                      {getFieldDecorator('consumerName', {
                        rules: [
                          {
                            required: true,
                            message: 'Please input Pet owner name!'
                          },
                          {
                            max: 50,
                            message: 'Pet owner name exceed the maximum length!'
                          }
                        ]
                      })(
                        <Input
                          disabled={detailForm.consumerType === 'Member' || this.state.isDetail}
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
                          disabled={detailForm.consumerType === 'Member' || this.state.isDetail}
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

                  <Col span={8}>
                    <FormItem
                      label={
                        <span>
                          Related Pet&nbsp;
                          <Tooltip title="Please select Pet owner account first!">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator(
                        'pet',
                        {}
                      )(
                        <Select
                          disabled={detailForm.consumerAccount === '' || this.state.isDetail}
                          placeholder="Please select pet"
                          getPopupContainer={(trigger: any) => trigger.parentNode}
                          onChange={(value, option: any) => {
                            let name = option.props.children;
                            value = value === '' ? null : value;
                            this.onDetailsFormChange({
                              field: 'petId',
                              value
                            });

                            this.onDetailsFormChange({
                              field: 'petName',
                              value: name
                            });

                            this.props.form.setFieldsValue({
                              pet: name
                            });
                          }}
                        >
                          {petList &&
                            petList.map((item) => (
                              <Option value={item.petsId} key={item.id}>
                                {item.petsName}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>

                  <Col span={8}>
                    <FormItem
                      label={
                        <span>
                          CC List&nbsp;
                          <Tooltip title="If you have multiple mailboxes, use a semicolon to separate them!">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      }
                    >
                      {getFieldDecorator(
                        'ccList',
                        {}
                      )(
                        <Input
                          disabled={this.state.isDetail}
                          title={detailForm.ccList}
                          onChange={(e) => {
                            const value = (e.target as any).value;
                            this.onDetailsFormChange({
                              field: 'ccList',
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
            <Button type="primary" onClick={() => this.submit()} style={{ marginRight: 10 }}>
              Submit
            </Button>
          ) : null}
          {!this.state.isDetail ? (
            <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.save()}>
              {<FormattedMessage id="save" />}
            </Button>
          ) : null}

          <Button onClick={() => (history as any).go(-1)} style={{ marginRight: 10 }}>
            {<FormattedMessage id="back" />}
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
