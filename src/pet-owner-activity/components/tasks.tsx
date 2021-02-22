import React, { Component } from 'react';
import { history, Const, ReactEditor } from 'qmkit';
import { Input, Card, Icon, Row, Col, Select, message, Dropdown, Button, Menu, Checkbox, Timeline, Skeleton, DatePicker } from 'antd';
import * as webapi from '../webapi';
import moment from 'moment';

const Option = Select.Option;

export default class tasks extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      taskLoading: false,
      taskList: [
        {
          assistantEmail: 'morgane.daum@royalcanin.com',
          assistantId: 139,
          assistantName: 'Morgane DAUM',
          contactEmail: 'morgane.lucas1@ibm.com',
          contactId: 229,
          contactName: 'Morgane Lucas',
          description: '<p>need to call PO</p>',
          dueTime: '2021-01-20',
          goldenMoment: 'Subscription program cancelation by PO',
          id: 1229,
          name: 'Test 1',
          priority: 'High',
          startTime: '2021-01-19',
          status: 'To Do',
          showMore: false
        },
        {
          assistantEmail: 'morgane.daum@royalcanin.com',
          assistantId: 139,
          assistantName: 'Morgane DAUM',
          contactEmail: 'morgane.lucas1@ibm.com',
          contactId: 229,
          contactName: 'Morgane Lucas',
          description: '<p>need to call PO</p>',
          dueTime: '2021-01-20',
          goldenMoment: 'First month of Subscription',
          id: 1230,
          name: 'Test 2',
          priority: 'Low',
          startTime: '2021-01-19',
          status: 'Completed',
          showMore: false
        }
      ],
      assignedUsers: [],
      goldenMomentList: [],
      actionTypeList: ['Call', 'Email', 'N/A'],
      priorityList: ['Low', 'Medium', 'High'],
      associatedPetOwners: [],
      associatedPetList: [],
      associatedOrderList: [],
      statusList: ['To Do', 'On-going', 'Completed', 'Cancelled'],
      editble: false,
      newTask: {}
    };
    this.taskSort = this.taskSort.bind(this);
    this.setRedBoarder = this.setRedBoarder.bind(this);
    this.getGoldenMomentIcon = this.getGoldenMomentIcon.bind(this);
    this.onChange = this.onChange.bind(this);
    this.moreClick = this.moreClick.bind(this);
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

  taskSort() {}
  redirectDetail(id) {}

  searchAssignedTo = (value) => {
    if (value) {
    }
  };
  setRedBoarder(item) {
    let style = '';
    if (item.status === 'Completed') {
      ('#FAFAFA;');
    }
    return style;
  }
  getGoldenMomentIcon(goldenMoment) {
    let iconItem = this.state.goldenMomentList.find((x) => x.value === goldenMoment);
    if (!iconItem) {
      return '';
    }
    return iconItem.valueEn;
  }
  onChange = ({ field, value }) => {
    let data = this.state.newTask;
    data[field] = value;
    this.setState({
      newTask: data
    });
  };
  moreClick(task) {
    const { taskList } = this.state;
    taskList.map((item) => {
      if (item.id === task.id) {
        item.showMore = !task.showMore;
      }
      return item;
    });
    this.setState({
      taskList
    });
  }
  render() {
    const { taskLoading, taskList, editble } = this.state;
    const { assignedUsers, associatedPetList, associatedOrderList } = this.state;
    const { goldenMomentList, actionTypeList, priorityList, statusList } = this.state;
    const menu = (
      <Menu>
        <Menu.Item key={1}>Add Comment</Menu.Item>
        <Menu.Item key={2}>Add Task</Menu.Item>
      </Menu>
    );
    return (
      <Row>
        <Col span={9}></Col>
        <Col span={15} className="activities-right" style={{ marginBottom: '20px' }}>
          {/* <Dropdown trigger={['click']} overlayClassName="dropdown-custom" style={{marginRight: '10px'}}>
                  <Button className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    Email Type
                    <Icon className="down" />
                  </Button>
                  <Menu slot="overlay">
                    <Checkbox
                      :indeterminate="indeterminateEmail"
                      @change="onCheckAllEamil"
                      :checked="checkEmailAll"
                    >{{ $t('public.selectAll') }}</Checkbox>
                    <Divider />
                    <CheckboxGroup v-model="emailCheckedList" @change="emailChange">
                      <Row :gutter="24" v-for="(item, i) in emailFilter" :key="i">
                        <Col span={24}>
                          <Checkbox :value="item.value">{{ item.label }}</Checkbox>
                        </Col>
                      </Row>
                    </CheckboxGroup>
                  </Menu>
                </Dropdown> */}
          <Button className="sortBtn" onClick={this.taskSort}>
            <span className="icon iconfont iconbianzu" style={{ fontSize: '22px' }} />
          </Button>
          <Dropdown overlay={menu}>
            <Button className="addCommentBtn">
              <span className="icon iconfont iconbianzu9" style={{ fontSize: '22px' }} />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          <Timeline pending={taskLoading} className="contactTaskList">
            {taskList.map((item, index) => (
              <Timeline.Item key={index} className="listitem">
                <div className="contactTaskCard" style={{ background: this.setRedBoarder(item) }}>
                  <Row className="taskHeader padding">
                    <Col span={12}>
                      <Row>
                        <Col span={6}>
                          <div className="goldenMomentPanel">
                            <span className={this.getGoldenMomentIcon(item.goldenMoment) + ' icon iconfont'} />
                          </div>
                        </Col>
                        <Col span={16}>
                          <span className="tasksLable">Tasks</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={12}>
                      <Row style={{ textAlign: 'right' }}>
                        <Select
                          style={{ width: '70%' }}
                          defaultValue={item.status}
                          onChange={(value) =>
                            this.onChange({
                              field: 'status',
                              value: value
                            })
                          }
                        >
                          {statusList.map((item) => (
                            <Option value={item} key={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                        <span className="icontiaozhuan icon iconfont" style={{ marginLeft: '15px' }} onClick={() => this.redirectDetail(item.id)} />
                      </Row>
                    </Col>
                  </Row>
                  <div>
                    <Row className="padding">
                      <Col span={12}>
                        <div className="taskContactLable">
                          {' '}
                          <span className="icontaskName icon iconfont addTaskIcon" />
                          Name
                        </div>
                        <Input
                          style={{ width: '97%' }}
                          defaultValue={item.name}
                          disabled={item.taskCompleted}
                          onChange={(e: any) =>
                            this.onChange({
                              field: 'name',
                              value: e.target.value
                            })
                          }
                        />
                      </Col>
                      <Col span={12}>
                        <div className="taskContactLable">
                          <span className="iconxingzhuang icon iconfont addTaskIcon" />
                          Assigned to
                        </div>
                        <Select
                          defaultValue={item.assistantName}
                          disabled={item.taskCompleted}
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
                      </Col>
                    </Row>
                    <Row className="padding">
                      <Col span={12}>
                        <div className="taskContactLable">
                          <span className="iconshizhong icon iconfont addTaskIcon" />
                          Start Time
                        </div>
                        <DatePicker
                          defaultValue={moment(item.startTime)}
                          disabled={item.taskCompleted || !!item.startTime}
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
                      </Col>
                      <Col span={12}>
                        <div className="taskContactLable">
                          <span className="iconshizhong icon iconfont addTaskIcon" />
                          Due Time
                        </div>
                        <DatePicker
                          defaultValue={moment(item.dueTime)}
                          disabled={item.taskCompleted}
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
                      </Col>
                    </Row>
                    <Row className="padding">
                      <Col span={12}>
                        <div className="taskContactLable">
                          <span className="iconbianzu7 icon iconfont addTaskIcon" />
                          Golden Moment
                        </div>
                        <Select
                          defaultValue={item.goldenMoment}
                          disabled={item.taskCompleted || !!item.goldenMoment}
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
                      </Col>
                    </Row>
                  </div>
                  {!item.showMore ? (
                    <div>
                      <div className="upborder"></div>
                    </div>
                  ) : null}
                  {item.showMore ? (
                    <Row>
                      <div>
                        <div className="padding">
                          <div className="taskContactLable">
                            <span className="icondescribe icon iconfont addTaskIcon" />
                            Task Description
                          </div>
                          <Row>
                            <ReactEditor
                              disabled={item.taskCompleted}
                              id="description"
                              height={200}
                              content={item.description}
                              onContentChange={(html) =>
                                this.onChange({
                                  field: 'description',
                                  value: html
                                })
                              }
                            />
                          </Row>
                        </div>
                        <Row className="padding">
                          <Col span={12}>
                            <div className="taskContactLable">
                              <span className="iconpaixu icon iconfont addTaskIcon" />
                              Priority
                            </div>
                            <Select
                              defaultValue={item.priority}
                              disabled={item.taskCompleted}
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
                          </Col>
                          <Col span={12}>
                            <div className="taskContactLable">
                              <span className="iconorder icon iconfont addTaskIcon" />
                              Action Type
                            </div>
                            <Select
                              defaultValue={item.actionType}
                              disabled={item.taskCompleted}
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
                          </Col>
                        </Row>
                        <Row className="padding">
                          <Col span={12}>
                            <div className="taskContactLable">
                              <span className="iconbianzu icon iconfont addTaskIcon" />
                              Associated Pet
                            </div>
                            <Select
                              defaultValue={item.associatedPet}
                              disabled={item.taskCompleted || !!item.associatedPet}
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
                          </Col>
                          <Col span={12}>
                            <div className="taskContactLable">
                              <span className="iconjishiben icon iconfont addTaskIcon" />
                              Associated Order
                            </div>
                            <Select
                              defaultValue={item.associatedOrder}
                              disabled={item.taskCompleted || !!item.associatedOrder}
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
                          </Col>
                        </Row>
                      </div>
                    </Row>
                  ) : null}
                  <div className={item.showMore ? 'upborder' : ''}>
                    <div className="more">
                      <a onClick={() => this.moreClick(item)}>
                        <Icon type={item.showMore ? 'up' : 'down'} /> {item.showMore ? 'Less' : 'More'}{' '}
                      </a>
                    </div>
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
          <div style={{ textAlign: 'center' }}>
            <Button type="link" className="jump-link">
              View More
            </Button>
          </div>
        </Col>
      </Row>
    );
  }
}
