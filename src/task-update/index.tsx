import React, { Component } from 'react';
import { BreadCrumb, SelectGroup, Const, Headline, ReactEditor } from 'qmkit';
import { Form, Input, Button, Col, Row, Select, InputNumber, message, Icon, Switch, DatePicker, Tabs } from 'antd';
import ServiceList from './components/service-list';
import Activity from './components/activity';
import './style.less';
import * as webapi from './webapi';

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
      task: {},
      assignedUsers: [],
      goldenMomentList: [],
      actionTypeList: ['Call', 'Email', 'N/A'],
      priorityList: ['Low', 'Medium', 'High'],
      associatedPetOwners: [],
      associatedPetList: [],
      associatedOrderList: []
    };
    this.onChange = this.onChange.bind(this);
    this.searchAssignedTo = this.searchAssignedTo.bind(this);
    this.searchAssignedPetOwners = this.searchAssignedPetOwners.bind(this);
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
  }
  onChange = ({ field, value }) => {
    let data = this.state.task;
    data[field] = value;
    this.setState({
      task: data
    });
  };
  searchAssignedTo = (value) => {
    if (value) {
    }
  };
  searchAssignedPetOwners = (value) => {
    if (value) {
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { title, task, assignedUsers, goldenMomentList, actionTypeList, priorityList, associatedPetOwners, associatedPetList, associatedOrderList } = this.state;
    return (
      <div>
        <BreadCrumb />
        <div className="container-search">
          <Headline title={title} />
        </div>
        <div className="container">
          <Tabs defaultActiveKey="basic">
            <TabPane tab="Basic information" key="basic">
              <Form>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Task Name">
                      {getFieldDecorator('name', {
                        initialValue: task.name,
                        rules: [{ required: true, message: 'Please input task name' }]
                      })(
                        <Input
                          placeholder="Input task name to create a new task"
                          onChange={(e: any) =>
                            this.onChange({
                              field: 'name',
                              value: e.target.value
                            })
                          }
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Assigned to">
                      {getFieldDecorator('assignedTo', {
                        initialValue: task.assignedTo
                      })(
                        <Select
                          placeholder="Please input email"
                          showSearch
                          onSearch={this.searchAssignedTo}
                          onChange={(value) =>
                            this.onChange({
                              field: 'assignedTo',
                              value: value
                            })
                          }
                        >
                          {assignedUsers.map((item) => (
                            <Option value={item.id} key={item.id}>
                              {item.valueEn}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Golden Moment">
                      {getFieldDecorator('goldenMoment', {
                        initialValue: task.goldenMoment,
                        rules: [{ required: true, message: 'Please select golden moment' }]
                      })(
                        <Select
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
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Start Time">
                      {getFieldDecorator('startTime', {
                        initialValue: task.startTime,
                        rules: [{ required: true, message: 'Please select start time' }]
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          placeholder="Start Time"
                          format="YYYY-MM-DD"
                          onChange={(date, dateString) => {
                            const value = dateString;
                            this.onChange({
                              field: 'startTime',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Due Time">
                      {getFieldDecorator('dueTime', {
                        initialValue: task.startTime,
                        rules: [{ required: true, message: 'Please select due time' }]
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          placeholder="Due Time"
                          format="YYYY-MM-DD"
                          onChange={(date, dateString) => {
                            const value = dateString;
                            this.onChange({
                              field: 'dueTime',
                              value
                            });
                          }}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Action Type">
                      {getFieldDecorator('actionType', {
                        initialValue: task.actionType
                      })(
                        <Select
                          onChange={(value) =>
                            this.onChange({
                              field: 'actionType',
                              value: value
                            })
                          }
                        >
                          {actionTypeList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Priority">
                      {getFieldDecorator('priority', {
                        initialValue: task.priority
                      })(
                        <Select
                          onChange={(value) =>
                            this.onChange({
                              field: 'priority',
                              value: value
                            })
                          }
                        >
                          {priorityList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Associated Pet Owner">
                      {getFieldDecorator('associatedPetOwner', {
                        initialValue: task.associatedPetOwner
                      })(
                        <Select
                          placeholder="Please input name"
                          showSearch
                          onSearch={this.searchAssignedPetOwners}
                          onChange={(value) =>
                            this.onChange({
                              field: 'associatedPetOwner',
                              value: value
                            })
                          }
                        >
                          {associatedPetOwners.map((item) => (
                            <Option value={item.id} key={item.id}>
                              {item.valueEn}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Associated Pet">
                      {getFieldDecorator('associatedPet', {
                        initialValue: task.associatedPet
                      })(
                        <Select
                          onChange={(value) =>
                            this.onChange({
                              field: 'associatedPet',
                              value: value
                            })
                          }
                        >
                          {associatedPetList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="Associated Order">
                      {getFieldDecorator('associatedOrder', {
                        initialValue: task.associatedOrder
                      })(
                        <Select
                          onChange={(value) =>
                            this.onChange({
                              field: 'associatedOrder',
                              value: value
                            })
                          }
                        >
                          {associatedOrderList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <FormItem {...formRowItemLayout} label="Description">
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
                  </FormItem>
                </Row>
              </Form>
            </TabPane>
            <TabPane tab="Service List" key="services">
              <ServiceList goldenMomentList={goldenMomentList} goldenMoment={this.state.task.goldenMoment} />
            </TabPane>
            <TabPane tab="Activity" key="activity">
              <Activity />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default Form.create()(TaskUpdate);
