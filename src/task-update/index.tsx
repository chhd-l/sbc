import React, { Component } from 'react';
import { Const, Headline, ReactEditor, history, cache } from 'qmkit';
import { Form, Input, Button, Col, Row, Select, message, DatePicker, Tabs, Breadcrumb, Tooltip, InputNumber } from 'antd';
import ServiceList from './components/service-list';
import Activity from './components/activity';
import './style.less';
import * as webapi from './webapi';
import moment from 'moment';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;
const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 8 }
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
class TaskUpdate extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: this.props.match.params.id ? 'Task edition' : 'Task creation',
      taskCompleted: false,
      tabKey: '',
      task: {},
      assignedUsers: [],
      goldenMomentList: [],
      actionTypeList: [
        { name: 'Call', value: 'Call' },
        { name: 'Email', value: 'Email' },
        { name: 'N/A', value: 'N/A' }
      ],
      priorityList: [
        { name: 'Low', value: 'Low' },
        { name: 'Medium', value: 'Medium' },
        { name: 'High', value: 'High' }
      ],
      associatedPetOwners: [],
      associatedPetList: [],
      associatedOrderList: [],
      statusList: [
        { name: 'To Do', value: 'To Do' },
        { name: 'On-going', value: 'On-going' },
        { name: 'Completed', value: 'Completed' },
        { name: 'Cancelled', value: 'Cancelled' }
      ],
      editable: !this.props.match.params.id,
      reminderTypes: [
        { value: 'Day', name: 'Days' },
        { value: 'Minute', name: 'Minutes' },
        { value: 'Hour', name: 'Hours' },
        { value: 'Week', name: 'Weeks' }
      ],
      associatedSubscriptionList: []
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
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            goldenMomentList: res.context.sysDictionaryVOS
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
    const { id } = this.state;
    if (id) {
      webapi
        .getTaskById(id)
        .then((data) => {
          const res = data.res;
          if (res.code === Const.SUCCESS_CODE) {
            let taskStatus = res.context.task.status;
            this.setState({
              task: res.context.task,
              taskCompleted: taskStatus === 'Completed' || taskStatus === 'Cancelled'
            });
            let customerAccount = res.context.task.customerAccount;
            if (customerAccount) {
              this.getPetOwnerPets(customerAccount);
              this.getPetOwnerOrders(customerAccount);
              this.getPetOwnerSubscriptions(customerAccount);
            }
          } else {
            message.error(res.message || 'Get data failed');
          }
        })
        .catch(() => {
          message.error('Get data failed');
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
    let params = {
      pageNum: 0,
      pageSize: 20,
      keyword: value
    };
    webapi
      .getEmployeesByKeyword(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            assignedUsers: res.context.employees
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }

  getPetOwners(value?: String) {
    let params = {
      pageNum: 0,
      pageSize: 20,
      customerAccount: value
    };
    webapi
      .getPetOwnerList(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            associatedPetOwners: res.context.detailResponseList
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
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
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
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
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
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
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }

  onChange = ({ field, value }) => {
    if (field === 'contactId') {
      this.getPetOwnerPets(value);
      this.getPetOwnerOrders(value);
      this.getPetOwnerSubscriptions(value); //search by customer account

      this.setState({
        task: {
          petName: '',
          petId: '',
          orderCode: ''
        }
      });
      this.props.form.setFieldsValue({
        petId: '',
        orderCode: ''
      });

      const { associatedPetOwners } = this.state;
      const petOwner = associatedPetOwners.find((x) => x.customerAccount === value);
      value = petOwner.customerId; // save by customerId
    }
    let data = this.state.task;
    data[field] = value;
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
        // console.log(task);
        if (id) {
          task.id = id; // edit by id
          webapi
            .updateTask(task)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success('Operate successfully');
                history.goBack();
              } else {
                message.error(res.message || 'Update Failed');
              }
            })
            .catch((err) => {
              message.error(err || 'Update Failed');
            });
        } else {
          webapi
            .createTask(task)
            .then((data) => {
              const { res } = data;
              if (res.code === 'K-000000') {
                message.success('Operate successfully');
                history.push({ pathname: '/tasks' });
              } else {
                message.error(res.message || 'Add Failed');
              }
            })
            .catch((err) => {
              message.error(err || 'Add Failed');
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
    const { title, tabKey, editable, task, id, taskCompleted, assignedUsers } = this.state;
    const { associatedPetOwners, associatedPetList, associatedOrderList } = this.state;
    const { goldenMomentList, actionTypeList, priorityList, statusList, reminderTypes, associatedSubscriptionList } = this.state;
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/tasks">Task board</a>
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
                  <Tooltip placement="top" title="Edit">
                    <Button style={{ marginRight: '20px' }} type="primary" onClick={() => this.setState({ editable: true })}>
                      Edit
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip placement="top" title="Cancel">
                    <Button onClick={() => this.setState({ editable: false })}>Cancel</Button>
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
            <TabPane tab="Basic information" key="basic">
              <Form>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Task Name">
                      {getFieldDecorator('name', {
                        initialValue: task.name,
                        rules: [{ required: true, message: 'Please input task name' }]
                      })(
                        editable ? (
                          <Input
                            disabled={taskCompleted}
                            placeholder="Input task name to create a new task"
                            onChange={(e: any) =>
                              this.onChange({
                                field: 'name',
                                value: e.target.value
                              })
                            }
                          />
                        ) : (
                          <span>{task.name}</span>
                        )
                      )}
                    </FormItem>
                  </Col>
                  {id ? (
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="Task Status">
                        {getFieldDecorator('status', {
                          initialValue: task.status
                        })(
                          editable ? (
                            <Select
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
                            <span>{task.status}</span>
                          )
                        )}
                      </FormItem>
                    </Col>
                  ) : null}
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Assigned to">
                      {getFieldDecorator('assistantId', {
                        initialValue: task.assistantName ? task.assistantName + '(' + task.assistantEmail + ')' : null
                      })(
                        editable ? (
                          <Select
                            disabled={taskCompleted}
                            placeholder="Please input email or name"
                            showSearch
                            onSearch={this.searchAssignedTo}
                            onChange={(value) =>
                              this.onChange({
                                field: 'assistantId',
                                value: value
                              })
                            }
                          >
                            {assignedUsers.map((item) => (
                              <Option value={item.employeeId} key={item.employeeId}>
                                {item.employeeName} {'(' + item.accountName + ')'})
                              </Option>
                            ))}
                          </Select>
                        ) : (
                          <span>{task.assistantName ? task.assistantName + (task.assistantEmail ? '(' + task.assistantEmail + ')' : '') : null}</span>
                        )
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Golden Moment">
                      {getFieldDecorator('goldenMoment', {
                        initialValue: task.goldenMoment
                      })(
                        editable ? (
                          <Select
                            disabled={taskCompleted}
                            onChange={(value) =>
                              this.onChange({
                                field: 'goldenMoment',
                                value: value
                              })
                            }
                          >
                            {goldenMomentList.map((item) => (
                              <Option value={item.value} key={item.id}>
                                {item.value}
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
                    <FormItem {...formItemLayout} label="Start Time">
                      {getFieldDecorator('startTime', {
                        initialValue: task.startTime ? moment(task.startTime) : null,
                        rules: [{ required: true, message: 'Please select start time' }]
                      })(
                        editable ? (
                          <DatePicker
                            disabledDate={this.disabledEventStartDate}
                            disabled={taskCompleted || (!!task.startTime && id)}
                            style={{ width: '100%' }}
                            placeholder="Start Time"
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
                          <span>{task.startTime}</span>
                        )
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Due Time">
                      {getFieldDecorator('dueTime', {
                        initialValue: task.dueTime ? moment(task.dueTime) : null,
                        rules: [{ required: true, message: 'Please select due time' }]
                      })(
                        editable ? (
                          <DatePicker
                            disabledDate={this.disabledEventEndDate}
                            disabled={taskCompleted}
                            style={{ width: '100%' }}
                            placeholder="Due Time"
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
                          <span>{task.dueTime}</span>
                        )
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Reminder before due time">
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
                    <FormItem {...formItemLayout} label="Priority">
                      {getFieldDecorator('priority', {
                        initialValue: task.priority
                      })(
                        editable ? (
                          <Select
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
                    <FormItem {...formItemLayout} label="Associated Pet Owner">
                      {getFieldDecorator('contactId', {
                        initialValue: task.petOwner ? task.petOwner + '(' + task.customerAccount + ')' : ''
                      })(
                        editable ? (
                          <Select
                            disabled={taskCompleted}
                            placeholder="Please input pet owner account"
                            showSearch
                            onSearch={this.searchAssignedPetOwners}
                            onChange={(value) =>
                              this.onChange({
                                field: 'contactId',
                                value: value
                              })
                            }
                          >
                            {associatedPetOwners.map((item) => (
                              <Option value={item.customerAccount} key={item.customerAccount}>
                                {item.customerName} {'(' + item.customerAccount + ')'}
                              </Option>
                            ))}
                          </Select>
                        ) : (
                          <Link to={`/customer-details/Member/${id}/${task.customerAccount}`}>{task.petOwner ? task.petOwner + '(' + task.customerAccount + ')' : ''}</Link>
                        )
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Associated Pet">
                      {getFieldDecorator('petId', {
                        initialValue: task.petId
                      })(
                        editable ? (
                          <Select
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
                          <Link to={`/customer-details/Member/${id}/${task.customerAccount}`}>{task.petName}</Link>
                        )
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Associated Order">
                      {getFieldDecorator('orderCode', {
                        initialValue: task.orderCode
                      })(
                        editable ? (
                          <Select
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
                    <FormItem {...formItemLayout} label="Action Type">
                      {getFieldDecorator('actionType', {
                        initialValue: task.actionType
                      })(
                        editable ? (
                          <Select
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
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Associate Subscription">
                      {getFieldDecorator('subscriptionNumber', {
                        initialValue: task.subscription
                      })(
                        editable ? (
                          <Select
                            disabled={taskCompleted}
                            onChange={(value) =>
                              this.onChange({
                                field: 'subscriptionNumber',
                                value: value
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
                          <Link to={`/subscription-detail/${task.subscriptionNumber}`}>{task.subscriptionNumber}</Link>
                        )
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  {editable ? (
                    <FormItem {...formRowItemLayout} label="Description">
                      {taskCompleted ? <ReactEditor id="description" height={200} disabled={true} content={task.description} onContentChange={(html) => {}} /> : null}
                      {task.description && !taskCompleted ? (
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
                      ) : null}
                      {!task.description && !taskCompleted ? (
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
                      ) : null}
                    </FormItem>
                  ) : (
                    <FormItem {...formRowItemLayout} label="Description">
                      <span dangerouslySetInnerHTML={{ __html: task.description }}></span>
                    </FormItem>
                  )}
                </Row>
              </Form>
            </TabPane>
            {/* <TabPane tab="Service List" key="services">
              <ServiceList goldenMomentList={goldenMomentList} goldenMoment={this.state.task.goldenMoment} />
            </TabPane> */}
            {id ? (
              <TabPane tab="Activity" key="activity">
                <Activity taskId={id} taskCompleted={taskCompleted} />
              </TabPane>
            ) : null}
          </Tabs>
        </div>
        {tabKey !== 'activity' ? (
          <div className="bar-button" style={{ left: '134px' }}>
            <Button type="primary" style={{ marginRight: '10px' }} onClick={(e) => this.updateTask(e)}>
              Save
            </Button>
            <Button type="primary" onClick={() => history.goBack()}>
              Back
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}
export default Form.create()(TaskUpdate);
