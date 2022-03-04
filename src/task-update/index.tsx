import React, { Component } from 'react';
import { Const, Headline, ReactEditor, history, cache } from 'qmkit';
import {
  Form,
  Input,
  Button,
  Col,
  Row,
  Select,
  message,
  DatePicker,
  Tabs,
  Breadcrumb,
  Tooltip,
  InputNumber,
  Spin
} from 'antd';
import Activity from './components/activity';
import './style.less';
import * as webapi from './webapi';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RCi18n } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Table, Divider, Tag } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 9 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const formRowItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

const formTableItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 },
    lg: { span: 5 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    lg: { span: 19 }
  }
};

@injectIntl
class TaskUpdate extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: this.props.match.params.id ? (
        <FormattedMessage id="task.Taskedition" />
      ) : (
        <FormattedMessage id="task.Taskcreation" />
      ),
      taskCompleted: false,
      tabKey: '',
      task: {},
      assignedUsers: [],
      goldenMomentList: [],
      subscriptionTable: [],
      actionTypeList: [
        { name: <FormattedMessage id="task.Call" />, value: 'Call' },
        { name: <FormattedMessage id="task.Email" />, value: 'Email' },
        { name: <FormattedMessage id="task.N/A" />, value: 'N/A' }
      ],
      priorityList: [
        { name: <FormattedMessage id="task.Low" />, value: 'Low' },
        { name: <FormattedMessage id="task.Medium" />, value: 'Medium' },
        { name: <FormattedMessage id="task.High" />, value: 'High' }
      ],
      deliveryMethodList:[
        { name: <FormattedMessage id="task.homeDelivery" />, value: 'home delivery' },
        { name: <FormattedMessage id="task.pickupPointDelivery" />, value: 'pickup point delivery' },
      ],
      deliveryStatusList:[
        { name: <FormattedMessage id="task.active" />, value: 'active' },
        { name: <FormattedMessage id="task.inactive" />, value: 'inactive' },
      ],
      associatedPetOwners: [],
      associatedPetList: [],
      associatedOrderList: [],
      statusList: [
        { name: <FormattedMessage id="task.ToDo" />, value: 'To Do' },
        { name: <FormattedMessage id="task.On-going" />, value: 'On-going' },
        { name: <FormattedMessage id="task.Completed" />, value: 'Completed' },
        { name: <FormattedMessage id="task.Cancelled" />, value: 'Cancelled' }
      ],
      editable: !this.props.match.params.id,
      reminderTypes: [
        { name: <FormattedMessage id="task.Days" />, value: 'Day' },
        { name: <FormattedMessage id="task.Minutes" />, value: 'Minute' },
        { name: <FormattedMessage id="task.Hours" />, value: 'Hour' },
        { name: <FormattedMessage id="task.Weeks" />, value: 'Week' }
      ],
      associatedSubscriptionList: [],
      loading: false,
      petAssistantLoading: false,
      petOwnerLoading: false
    };
    this.onChange = this.onChange.bind(this);
    this.searchAssignedTo = this.searchAssignedTo.bind(this);
    this.searchAssignedPetOwners = this.searchAssignedPetOwners.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.getPetOwners = this.getPetOwners.bind(this);
    this.getPetOwnerPets = this.getPetOwnerPets.bind(this);
    this.getPetOwnerOrders = this.getPetOwnerOrders.bind(this);
    this.getEmployees = this.getEmployees.bind(this);
    this.getPetOwnerSubscriptions = this.getPetOwnerSubscriptions.bind(this);
  }

  componentDidMount() {
    webapi
      .getGlodenMomentList()
      .then((data) => {
        const res = data.res;
        console.log(res.context.sysDictionaryVOS);
        console.log(res.context);
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            goldenMomentList: res.context.sysDictionaryVOS
          });

        } else {
          message.error(res.message || (window as any).RCi18n({ id: 'Public.GetDataFailed' }));
        }
      })
      .catch(() => {
        message.error((window as any).RCi18n({ id: 'Public.GetDataFailed' }));
      });
    const { id } = this.state;
    if (id) {
      this.setState({
        loading: true
      });
      webapi
        .getTaskById(id)
        .then((data) => {
          const res = data.res;
          console.log('1111');
          console.log(res.context);
          console.log('2222');
          if (res.code === Const.SUCCESS_CODE) {
            let taskStatus = res.context.task.status;
            this.setState({
              task: res.context.task,
              taskCompleted: taskStatus === 'Completed' || taskStatus === 'Cancelled',
              subscriptionTable: res.context.subscribeList,
              loading: false,
            });
            let customerAccount = res.context.task.customerAccount;
            if (customerAccount) {
              sessionStorage.setItem('taskCustomerAccount',customerAccount)
              this.getPetOwnerPets(customerAccount);
              this.getPetOwnerOrders(customerAccount);
              this.getPetOwnerSubscriptions(customerAccount);
            }
          } else {
            message.error(res.message || (window as any).RCi18n({ id: 'Public.GetDataFailed' }));
            this.setState({
              loading: false
            });
          }
        })
        .catch(() => {
          message.error((window as any).RCi18n({ id: 'Public.GetDataFailed' }));
          this.setState({
            loading: false
          });
        });
    } else {
      let currentUser = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
      if (currentUser) {
        this.setState({
          task: {
            assistantId: currentUser.employeeId,
            assistantName: currentUser.employeeName,
            assistantEmail: currentUser.accountName
          }
        });
      }
    }
    if (this.props.location.state && this.props.location.state.petOwner) {
      let petOwner = this.props.location.state.petOwner;
      this.setState({
        task: {
          contactId: petOwner.contactId,
          petOwner: petOwner.petOwnerName,
          customerAccount: petOwner.customerAccount
        }
      });
      if (petOwner.customerAccount) {
        this.getPetOwnerPets(petOwner.customerAccount);
        this.getPetOwnerOrders(petOwner.customerAccount);
        this.getPetOwnerSubscriptions(petOwner.customerAccount);
      }
    }
    this.getPetOwners();
    this.getEmployees();
  }

  getEmployees(value?: String) {
    this.setState({
      petAssistantLoading: true
    });
    let params = {
      pageNum: 0,
      pageSize: 20,
      keyword: value
    };
    webapi
      .getEmployeesByKeyword(params)
      .then((data) => {
        const res = data.res;
        console.log(res.context.employees);

        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            assignedUsers: res.context.employees,
            petAssistantLoading: false
          });
        } else {
          message.error(res.message || (window as any).RCi18n({ id: 'Public.GetDataFailed' }));
          this.setState({
            petAssistantLoading: false
          });
        }
      })
      .catch(() => {
        message.error((window as any).RCi18n({ id: 'Public.GetDataFailed' }));
        this.setState({
          petAssistantLoading: false
        });
      });
  }

  getPetOwners(value?: String) {
    this.setState({
      petOwnerLoading: true
    });
    let params = {
      pageNum: 0,
      pageSize: 20,
      keyword: value
    };
    webapi
      .getPetOwnerList(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            associatedPetOwners: res.context.detailResponseList,
            petOwnerLoading: false
          });
        } else {
          message.error(res.message || (window as any).RCi18n({ id: 'Public.GetDataFailed' }));
          this.setState({
            petOwnerLoading: false
          });
        }
      })
      .catch(() => {
        message.error((window as any).RCi18n({ id: 'Public.GetDataFailed' }));
        this.setState({
          petOwnerLoading: false
        });
      });
  }

  getPetOwnerPets(customerAccount) {
    webapi
      .getPetOwnerPets(customerAccount)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            associatedPetList: res.context.context
          });
        } else {
          message.error(res.message || (window as any).RCi18n({ id: 'Public.GetDataFailed' }));
        }
      })
      .catch(() => {
        message.error((window as any).RCi18n({ id: 'Public.GetDataFailed' }));
      });
  }

  getPetOwnerOrders(customerAccount) {
    webapi
      .getPetOwnerOrders(customerAccount)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            associatedOrderList: res.context.content
          });
        } else {
          message.error(res.message || (window as any).RCi18n({ id: 'Public.GetDataFailed' }));
        }
      })
      .catch(() => {
        message.error((window as any).RCi18n({ id: 'Public.GetDataFailed' }));
      });
  }

  getPetOwnerSubscriptions(customerAccount) {
    webapi
      .getPetOwnerSubscriptions(customerAccount)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            associatedSubscriptionList: res.context.subscriptionResponses
          });
        } else {
          message.error(res.message || (window as any).RCi18n({ id: 'Public.GetDataFailed' }));
        }
      })
      .catch(() => {
        message.error((window as any).RCi18n({ id: 'Public.GetDataFailed' }));
      });
  }

  onChange = ({ field, value }) => {
    const { associatedPetOwners } = this.state;
    let data = this.state.task;

    if (field === 'contactId') {
      const petOwner = associatedPetOwners.find((x) => x.customerAccount === value);
      data[field] = petOwner ? petOwner.customerId : ''; // save by customerId

      this.getPetOwnerPets(value);
      this.getPetOwnerOrders(value);
      this.getPetOwnerSubscriptions(value); //search by customer account
      this.setState({
        task: {
          petName: '',
          petId: '',
          orderCode: '',
          subscriptionNumber: ''
        }
      });
      this.props.form.setFieldsValue({
        petId: '',
        orderCode: '',
        subscriptionNumber: []
      });
    } else {
      data[field] = value;
    }
    this.setState({
      task: data
    });
  };
  searchAssignedTo = (value) => {
    this.getEmployees(value);
  };
  searchAssignedPetOwners = (value) => {
    this.getPetOwners(value);
  };
  updateTask(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const { task, id } = this.state;
        if (id) {
          task.id = id; // edit by id
          webapi
            .updateTask(task)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success((window as any).RCi18n({ id: 'Content.OperateSuccessfully' }));
                history.goBack();
              } else {
                message.error(res.message || (window as any).RCi18n({ id: 'Order.UpdateFailed' }));
              }
            })
            .catch((err) => {
              message.error(err || (window as any).RCi18n({ id: 'Order.UpdateFailed' }));
            });
        } else {
          webapi
            .createTask(task)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success((window as any).RCi18n({ id: 'Content.OperateSuccessfully' }));
                history.push({ pathname: '/tasks' });
              } else {
                message.error(res.message || (window as any).RCi18n({ id: 'Order.AddFailed' }));
              }
            })
            .catch((err) => {
              message.error(err || (window as any).RCi18n({ id: 'Order.AddFailed' }));
            });
        }
      }
    });
  }

  disabledEventStartDate = (startValue) => {
    const { task } = this.state;
    let endValue = task.dueTime ? moment(task.dueTime) : null;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEventEndDate = (endValue) => {
    const { task } = this.state;
    let startValue = task.startTime ? moment(task.startTime) : null;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      title,
      tabKey,
      editable,
      task,
      id,
      taskCompleted,
      assignedUsers,
      petAssistantLoading,
      petOwnerLoading
    } = this.state;
    const { associatedPetOwners, associatedPetList, associatedOrderList } = this.state;
    const {
      goldenMomentList,
      actionTypeList,
      priorityList,
      statusList,
      reminderTypes,
      associatedSubscriptionList
    } = this.state;
    let taskStatus = statusList.find((x) => x.value === task.status);
    let subscriptionNumbers = task.subscriptionNumber ? task.subscriptionNumber.split(',') : [];

    const columns = [
      {
        title: RCi18n({ id: 'Task.SubscriptionNumber' }),
        dataIndex: 'subscriptionNumber',
        key: 'subscriptionNumber',
        width: '17%',
        render: text =>
          <a
            onClick={()=>{sessionStorage.setItem('taskId',id);
            sessionStorage.setItem('fromTaskToSubDetail','true');
            sessionStorage.setItem('taskEventTriggerName',task.eventTriggerName)
            history.push(`/subscription-detail/${text}`)}}
          >
            {text}
          </a>
      },
      {
        title: RCi18n({ id: 'Task.ProductName' }),
        key: 'nameAndDateVOList',
        width: '14%',
        render: (text, record, index) => {
          // let html = text.replaceAll(",", "<br/>")
          // let productNames = text.split(',')
          let nameAndDateVOList = record.nameAndDateVOList ? record.nameAndDateVOList : []
          return <div>
            {
              nameAndDateVOList && nameAndDateVOList.map(data => (
                <Tooltip placement="topLeft" title={data.productName}>
                  <p className="msg" style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer'
                  }} >{data.productName} </p>
                </Tooltip>
              ))
            }
          </div>
        },
        ellipsis: true,
      },
      {
        title: RCi18n({ id: 'Task.ShipmentDate' }),
        // dataIndex: 'shipmentDate',
        key: 'shipmentDate',
        width: '14%',
        render: (text, record, index) => {
          // let html = text.replaceAll(",", "<br/>")
          // let productNames = text.split(',')
          let nameAndDateVOList = record.nameAndDateVOList
          return <div>
            {
              nameAndDateVOList && nameAndDateVOList.map(data => (
                <p>{data.shipmentDate} </p>
              ))
            }
          </div>
        },
      },
      {
        title: RCi18n({ id: 'Task.DeliveryMethod' }),
        dataIndex: 'deliveryMethod',
        key: 'deliveryMethod'
      },
      {
        title: RCi18n({ id: 'Task.DeliveryAddress' }),
        dataIndex: 'deliveryAddress',
        key: 'deliveryAddress'
      },
      {
        title: RCi18n({ id: 'Task.DeliveryStatus' }),
        dataIndex: 'deliveryStatus',
        key: 'deliveryStatus'
      },
      {
        title: RCi18n({ id: 'Task.PaymentMethod' }),
        dataIndex: 'paymentMethod',
        key: 'paymentMethod'
      }
    ];

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">
              <FormattedMessage id="Menu.Home" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/tasks">
              <FormattedMessage id="task.TaskBoard" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container-search">
          <Row>
            <Col span={12}>
              <Headline title={title} />
            </Col>
            {tabKey !== 'activity' ? (
              <Col span={12} style={{ textAlign: 'right' }}>
                {!editable ? (
                  <Tooltip placement="top" title={RCi18n({ id: 'task.Edit' })}>
                    <Button
                      style={{ marginRight: '20px' }}
                      type="primary"
                      onClick={() => this.setState({ editable: true })}
                    >
                      <FormattedMessage id="task.Edit" />
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip placement="top" title={RCi18n({ id: 'task.Cancel' })}>
                    <Button onClick={() => this.setState({ editable: false })}>
                      <FormattedMessage id="task.Cancel" />
                    </Button>
                  </Tooltip>
                )}
              </Col>
            ) : null}
          </Row>
        </div>
        <div className="container">
          <Tabs
            defaultActiveKey="basic"
            onChange={(key) => {
              this.setState({ tabKey: key });
            }}
          >
            <TabPane tab={<FormattedMessage id="task.BasicInformation" />} key="basic">
              <Spin
                spinning={this.state.loading}
              >
                <Form>
                  <Row>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label={<FormattedMessage id="task.TaskName" />}>
                        {getFieldDecorator('name', {
                          initialValue: task.name,
                          rules: [{ required: true, message: <FormattedMessage id="task.Pleaseinputname" /> }]
                        })(
                          editable ? (
                            <Input
                              disabled={taskCompleted}
                              placeholder={(window as any).RCi18n({
                                id: 'task.Inputtasknametocreateanewtask'
                              })}
                              onChange={(e: any) =>
                                this.onChange({
                                  field: 'name',
                                  value: e.target.value
                                })
                              }
                            />
                          ) : (
                            <Tooltip placement="topLeft" title={task.name} >
                              <p className="taskName" >{task.name}</p >
                            </Tooltip>
                          )
                        )}
                      </FormItem>
                    </Col>
                    {id ? (
                      <Col span={12}>
                        <FormItem
                          {...formItemLayout}
                          label={<FormattedMessage id="task.TaskStatus" />}
                        >
                          {getFieldDecorator('status', {
                            initialValue: task.status
                          })(
                            editable ? (
                              <Select
                                allowClear
                                onChange={(value) =>
                                  this.onChange({
                                    field: 'status',
                                    value: value
                                  })
                                }
                              >
                                {statusList.map((item) => (
                                  <Option value={item.value} key={item.value}>
                                    {item.name}
                                  </Option>
                                ))}
                              </Select>
                            ) : (
                              <span>{taskStatus ? taskStatus.name : ''}</span>
                            )
                          )}
                        </FormItem>
                      </Col>
                    ) : null}
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.Assignedto" />}
                      >
                        {getFieldDecorator('assistantId', {
                          initialValue: task.assistantName
                            ? task.assistantName +
                            (task.assistantEmail ? '(' + task.assistantEmail + ')' : '')
                            : ''
                        })(
                          editable ? (
                            <Select
                              allowClear
                              disabled={taskCompleted}
                              placeholder={(window as any).RCi18n({
                                id: 'task.Pleaseinputemailorname'
                              })}
                              showSearch
                              loading={petAssistantLoading}
                              onSearch={this.searchAssignedTo}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'assistantId',
                                  value: value
                                })
                              }
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.props.children
                                  .toString()
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {assignedUsers.map((item) => (
                                <Option value={item.employeeId} key={item.employeeId}>
                                  {item.employeeName}{' '}
                                  {item.accountName ? '(' + item.accountName + ')' : ''}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <span>
                              {task.assistantName
                                ? task.assistantName +
                                (task.assistantEmail ? '(' + task.assistantEmail + ')' : '')
                                : ''}
                            </span>
                          )
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.GoldenMoment" />}
                      >
                        {getFieldDecorator('goldenMoment', {
                          initialValue: task.goldenMoment
                        })(
                          editable ? (
                            <Select
                              allowClear
                              disabled={taskCompleted}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'goldenMoment',
                                  value: value
                                })
                              }
                            >
                              {goldenMomentList.map((item) => (
                                <Option value={item.valueEn} key={item.id}>
                                  {item.valueEn}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <span>{task.goldenMoment}</span>
                          )
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.StartTime" />}
                      >
                        {getFieldDecorator('startTime', {
                          initialValue: task.startTime ? moment(task.startTime) : null,
                          rules: [
                            {
                              required: true,
                              message: <FormattedMessage id="task.Pleaseselectstarttime" />
                            }
                          ]
                        })(
                          editable ? (
                            <DatePicker
                              disabledDate={this.disabledEventStartDate}
                              disabled={taskCompleted || (!!task.startTime && id)}
                              style={{ width: '100%' }}
                              placeholder={(window as any).RCi18n({ id: 'task.StartTime' })}
                              format="YYYY-MM-DD"
                              onChange={(date, dateString) => {
                                const value = dateString ? dateString + ' 00:00:00' : null;
                                this.onChange({
                                  field: 'startTime',
                                  value
                                });
                              }}
                            />
                          ) : (
                            <span>
                              {task.startTime
                                ? moment(task.startTime).format('YYYY-MM-DD')
                                : ''}
                            </span>
                          )
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label={<FormattedMessage id="task.DueTime" />}>
                        {getFieldDecorator('dueTime', {
                          initialValue: task.dueTime ? moment(task.dueTime) : null,
                          rules: [
                            {
                              required: true,
                              message: <FormattedMessage id="task.Pleaseselectduetime" />
                            }
                          ]
                        })(
                          editable ? (
                            <DatePicker
                              disabledDate={this.disabledEventEndDate}
                              disabled={taskCompleted}
                              style={{ width: '100%' }}
                              placeholder={(window as any).RCi18n({ id: 'task.DueTime' })}
                              format="YYYY-MM-DD"
                              onChange={(date, dateString) => {
                                const value = dateString ? dateString + ' 00:00:00' : null;
                                this.onChange({
                                  field: 'dueTime',
                                  value
                                });
                              }}
                            />
                          ) : (
                            <span>
                              {task.dueTime
                                ? moment(task.dueTime).format('YYYY-MM-DD')
                                : ''}
                            </span>
                          )
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.Reminderbeforeduetime" />}
                      >
                        {editable ? (
                          <Row>
                            <Col span={8}>
                              {getFieldDecorator('reminderNumber', {
                                initialValue: task.reminderNumber
                              })(
                                <InputNumber
                                  min={task.reminderType === 'Minute' ? 10 : 0}
                                  disabled={taskCompleted}
                                  onChange={(value) =>
                                    this.onChange({
                                      field: 'reminderNumber',
                                      value: value
                                    })
                                  }
                                />
                              )}
                            </Col>
                            <Col span={16}>
                              {getFieldDecorator('reminderType', {
                                initialValue: task.reminderType ? task.reminderType : ''
                              })(
                                <Select
                                  allowClear
                                  disabled={taskCompleted}
                                  onChange={(value) =>
                                    this.onChange({
                                      field: 'reminderType',
                                      value: value
                                    })
                                  }
                                >
                                  {reminderTypes.map((item) => (
                                    <Option value={item.value} key={item.value}>
                                      {item.name}
                                    </Option>
                                  ))}
                                </Select>
                              )}
                            </Col>
                          </Row>
                        ) : (
                          <span>
                            {task.reminderNumber} {task.reminderType ? task.reminderType + 's' : ''}
                          </span>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label={<FormattedMessage id="task.Priority" />}>
                        {getFieldDecorator('priority', {
                          initialValue: task.priority
                        })(
                          editable ? (
                            <Select
                              allowClear
                              disabled={taskCompleted}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'priority',
                                  value: value
                                })
                              }
                            >
                              {priorityList &&
                                priorityList.map((item) => (
                                  <Option value={item.value} key={item.value}>
                                    {item.name}
                                  </Option>
                                ))}
                            </Select>
                          ) : (
                            <span>{task.priority}</span>
                          )
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.AssociatedPetOwner" />}
                      >
                        {getFieldDecorator('contactId', {
                          initialValue: task.petOwner
                            ? task.petOwner + '(' + task.customerAccount + ')'
                            : '',
                          rules: [{ required: true, message: <FormattedMessage id="task.Pleaseinputpetowneraccountorname" /> }]
                        })(
                          editable ? (
                            <Select
                              allowClear
                              disabled={taskCompleted}
                              placeholder={(window as any).RCi18n({
                                id: 'task.Pleaseinputpetowneraccountorname'
                              })}
                              showSearch
                              loading={petOwnerLoading}
                              onSearch={this.searchAssignedPetOwners}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'contactId',
                                  value: value
                                })
                              }
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.props.children
                                  .toString()
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {associatedPetOwners.map((item) => (
                                <Option value={item.customerAccount} key={item.customerAccount}>
                                  {item.customerName} {'(' + item.customerAccount + ')'}
                                </Option>
                              ))}
                            </Select>
                          ) : (<>
                            <Link
                              to={`/petowner-details/${task.contactId}/${task.customerAccount}`}
                            >
                              {task.petOwner
                                ? task.petOwner + '(' + task.customerAccount + ')'
                                : ''}
                            </Link><span style={{margin:"0 5px"}}></span>
                            {task.commentNumber ? <Link to={`/pet-owner-activity/${task.contactId}`}>[{task.commentNumber} comments available]</Link> : null}
                          </>)
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.AssociatedPet" />}
                      >
                        {getFieldDecorator('petId', {
                          initialValue: task.petId
                        })(
                          editable ? (
                            <Select
                              allowClear
                              disabled={taskCompleted}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'petId',
                                  value: value
                                })
                              }
                            >
                              {associatedPetList.map((item) => (
                                <Option value={item.petsId} key={item.petsId}>
                                  {item.petsName}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <Link
                              to={{
                                pathname: `/petowner-details/${task.contactId}/${task.customerAccount}`,
                                query: { hash: 'pets-list' }
                              }}
                            >
                              {task.petName}
                            </Link>
                          )
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.AssociatedOrder" />}
                      >
                        {getFieldDecorator('orderCode', {
                          initialValue: task.orderCode
                        })(
                          editable ? (
                            <Select
                              allowClear
                              disabled={taskCompleted}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'orderCode',
                                  value: value
                                })
                              }
                            >
                              {associatedOrderList.map((item) => (
                                <Option value={item.id} key={item.id}>
                                  {item.id}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <Link to={`/order-detail/${task.orderCode}`}>{task.orderCode}</Link>
                          )
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.ActionType" />}
                      >
                        {getFieldDecorator('actionType', {
                          initialValue: task.actionType
                        })(
                          editable ? (
                            <Select
                              allowClear
                              disabled={taskCompleted}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'actionType',
                                  value: value
                                })
                              }
                            >
                              {actionTypeList.map((item) => (
                                <Option value={item.value} key={item.value}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <span>{task.actionType}</span>
                          )
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  {/******/}


                  <Row>
                    {
                      editable ? <Col span={12}>
                        <FormItem
                          {...formItemLayout}
                          label={<FormattedMessage id="task.AssociateSubscription" />}
                        >
                          {getFieldDecorator('subscriptionNumber', {
                            initialValue: subscriptionNumbers
                          })(

                            <Select
                              mode="multiple"
                              allowClear
                              disabled={taskCompleted}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'subscriptionNumber',
                                  value: value ? (value as []).join(',') : ''
                                })
                              }
                            >
                              {associatedSubscriptionList.map((item) => (
                                <Option value={item.subscribeId} key={item.subscribeId}>
                                  {item.subscribeId}
                                </Option>
                              ))}
                            </Select>
                          )}
                        </FormItem>
                      </Col> :
                        <Col span={22}>
                          <FormItem
                            {...formTableItemLayout}
                            label={<FormattedMessage id="task.AssociateSubscription" />}
                          >
                            {/*&& task.eventTriggerName==='3DaysBeforeNextRefillOrder'*/}
                            {this.state.subscriptionTable.length>0 && JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId===123457907&& task.eventTriggerName==='3DaysBeforeNextRefillOrder' ?(
                                <Button
                                  style={{ marginBottom: '20px' }}
                                  type="primary"
                                  onClick={() => {sessionStorage.setItem('taskId',id);history.push('/task/manage-all-subscription')}}
                                >
                                  <FormattedMessage id="task.manageAllSubBtn" />
                                </Button>
                            ):null}
                            {getFieldDecorator('subscriptionNumber', {
                              initialValue: subscriptionNumbers
                            })(
                              < Table bordered columns={columns} dataSource={this.state.subscriptionTable} pagination={false} rowKey={(record) => record.subscriptionNumber} />
                            )}
                          </FormItem>
                        </Col>
                    }
                    {/* <Col span={12}>
                      <FormItem
                        {...formItemLayout}
                        label={<FormattedMessage id="task.AssociateSubscription" />}
                      >
                        {getFieldDecorator('subscriptionNumber', {
                          initialValue: subscriptionNumbers
                        })(
                          editable ? (
                            <Select
                              mode="multiple"
                              allowClear
                              disabled={taskCompleted}
                              onChange={(value) =>
                                this.onChange({
                                  field: 'subscriptionNumber',
                                  value: value ? (value as []).join(',') : ''
                                })
                              }
                            >
                              {associatedSubscriptionList.map((item) => (
                                <Option value={item.subscribeId} key={item.subscribeId}>
                                  {item.subscribeId}
                                </Option>
                              ))}
                            </Select>
                          ) : (
                            <>
                              <Table bordered columns={columns} />
                              {subscriptionNumbers.map((subscriptionNumber, index) => (
                                <>
                                  <Link
                                    key={subscriptionNumber}
                                    to={`/subscription-detail/${subscriptionNumber}`}
                                  >
                                    {subscriptionNumber}
                                    {index !== subscriptionNumbers.length - 1 ? ', ' : ''}
                                  </Link>
                                </>
                              ))}
                            </>
                          )
                        )}
                      </FormItem>
                    </Col> */}
                  </Row>
                  <Row>
                    {editable ? (
                      <FormItem
                        {...formRowItemLayout}
                        label={<FormattedMessage id="task.Description" />}
                      >
                        {taskCompleted ? (
                          <ReactEditor
                            id="description"
                            height={200}
                            disabled={true}
                            content={task.description}
                            onContentChange={(html) => { }}
                          />
                        ) : task.description ? (
                          <ReactEditor
                            id="description"
                            height={200}
                            content={task.description}
                            onContentChange={(html) =>
                              this.onChange({
                                field: 'description',
                                value: html
                              })
                            }
                          />
                        ) : (
                          <ReactEditor
                            id="description"
                            height={200}
                            content={''}
                            onContentChange={(html) =>
                              this.onChange({
                                field: 'description',
                                value: html
                              })
                            }
                          />
                        )}
                      </FormItem>
                    ) : (
                      <FormItem {...formRowItemLayout} label="Description">
                        <span dangerouslySetInnerHTML={{ __html: task.description }}></span>
                      </FormItem>
                    )}
                  </Row>
                </Form>
              </Spin>
            </TabPane>
            {id ? (
              <TabPane tab={<FormattedMessage id="task.Activity" />} key="activity">
                <Activity taskId={id} taskCompleted={taskCompleted} />
              </TabPane>
            ) : null}
          </Tabs>
        </div>
        {tabKey !== 'activity' ? (
          <div className="bar-button" style={{ left: '134px' }}>
            {editable ? (
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={(e) => this.updateTask(e)}
              >
                <FormattedMessage id="task.Save" />
              </Button>
            ) : null}
            <Button onClick={() => history.goBack()}>{<FormattedMessage id="task.Back" />}</Button>
          </div>
        ) : null}
      </div>
    );
  }
}
export default Form.create()(TaskUpdate);
