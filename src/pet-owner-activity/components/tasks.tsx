import React, { Component } from 'react';
import { Const, history } from 'qmkit';
import { Input, Icon, Row, Col, Select, message, Dropdown, Button, Menu, Timeline, Tooltip, Empty, Spin } from 'antd';
import * as webapi from '../webapi';
import { Link } from 'react-router-dom';
import { assign } from 'lodash';
import moment from 'moment';
import AddComment from './add-comment';

const Option = Select.Option;

export default class tasks extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      taskLoading: false,
      taskList: [],
      assignedUsers: [],
      goldenMomentList: [],
      actionTypeList: ['Call', 'Email', 'N/A'],
      priorityList: ['Low', 'Medium', 'High'],
      associatedPetOwners: [],
      associatedPetList: [],
      associatedOrderList: [],
      statusList: ['To Do', 'On-going', 'Completed', 'Cancelled'],
      editble: false,
      taskForm: {},
      circleBackground: [
        { type: 'To Do', color: 'rgba(233, 63, 81)' },
        { type: 'On-going', color: 'rgba(57, 173, 255)' },
        { type: 'Completed', color: 'rgba(114, 198, 127)' },
        { type: 'Cancelled', color: 'rgba(172, 176, 180)' }
      ],
      isAll: false,
      orderBy: 0,
      visible: false
    };
    this.onChange = this.onChange.bind(this);
    this.moreClick = this.moreClick.bind(this);
    this.getPetOwnerTasks = this.getPetOwnerTasks.bind(this);
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

    this.getPetOwnerTasks();
  }

  getPetOwnerTasks() {
    this.setState({
      taskLoading: true
    });
    const { taskForm, isAll, orderBy } = this.state;
    let param = Object.assign(taskForm, {
      customerId: this.props.petOwnerId,
      isAll: isAll,
      orderBy: orderBy
    });
    webapi
      .getPetOwnerTasks(param)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          res.context.tasks.map((item) => {
            item.showBasicInfo = item.status !== 'Completed';
          });
          this.setState({
            taskList: res.context.tasks || [],
            taskLoading: false
          });
        } else {
          message.error(res.message || 'Get data failed');
          this.setState({
            taskLoading: false
          });
        }
      })
      .catch(() => {
        message.error('Get data failed');
        this.setState({
          taskLoading: false
        });
      });
  }
  redirectDetail(id) {
    history.push(`/edit-task/${id}`);
  }

  getBackground(type) {
    return this.state.circleBackground.find((x) => x.type === type).color;
  }
  onChange = ({ field, value }) => {
    let data = this.state.taskForm;
    data[field] = value;
    this.setState(
      {
        taskForm: data
      },
      () => this.getPetOwnerTasks()
    );
  };
  moreClick(task) {
    const { taskList } = this.state;
    taskList.map((item) => {
      if (item.id === task.id) {
        if (item.status === 'Completed') {
          if (item.showBasicInfo) {
            item.showMore = false;
            item.showBasicInfo = false;
          } else {
            item.showMore = true;
            item.showBasicInfo = true;
          }
        } else {
          if (item.showMore) {
            item.showMore = false;
          } else {
            item.showMore = true;
          }
        }
        return item;
      }
    });
    this.setState({
      taskList
    });
  }
  render() {
    const { taskLoading, taskList, isAll, orderBy } = this.state;
    const { goldenMomentList, statusList, visible } = this.state;
    const { petOwner } = this.props;
    const menu = (
      <Menu>
        <Menu.Item key={1}>
          {' '}
          <a onClick={() => this.setState({ visible: true })}> Add Comment</a>
        </Menu.Item>
        <Menu.Item key={2}>
          {' '}
          <a onClick={() => history.push('/add-task', { petOwner: { contactId: this.props.petOwnerId, petOwnerName: petOwner.contactName, customerAccount: petOwner.customerAccount } })}>Add Task</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Row>
        <Col span={7}>
          <Input
            className="searchInput"
            placeholder="Keyword"
            onPressEnter={() => this.getPetOwnerTasks()}
            onChange={(e) => {
              const value = (e.target as any).value;
              let data = this.state.taskForm;
              data['keyword'] = value;
              this.setState({
                taskForm: data
              });
            }}
            style={{ width: '140px' }}
            prefix={<Icon type="search" onClick={() => this.getPetOwnerTasks()} />}
          />
        </Col>
        <Col span={17} className="activities-right" style={{ marginBottom: '20px' }}>
          <Select
            className="filter"
            placeholder="Task Status"
            allowClear={true}
            dropdownMatchSelectWidth={false}
            maxTagCount={0}
            style={{ width: '105px' }}
            mode="multiple"
            onChange={(value) =>
              this.onChange({
                field: 'statuses',
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
          <Select
            className="filter"
            placeholder="GoldenMoment"
            allowClear={true}
            dropdownMatchSelectWidth={false}
            maxTagCount={0}
            style={{ width: '120px' }}
            mode="multiple"
            onChange={(value) =>
              this.onChange({
                field: 'goldenMoments',
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
          <Button
            className="sortBtn"
            onClick={() => {
              this.setState(
                {
                  orderBy: orderBy === 0 ? 1 : 0
                },
                () => this.getPetOwnerTasks()
              );
            }}
          >
            <span className="icon iconfont iconbianzusort" style={{ fontSize: '20px' }} />
          </Button>
          <Dropdown overlay={menu}>
            <Button className="addCommentBtn">
              <span className="icon iconfont iconbianzu9" style={{ fontSize: '20px' }} />
            </Button>
          </Dropdown>
        </Col>
        <Col span={24}>
          {taskList && taskList.length > 0 ? (
            <Spin spinning={taskLoading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px' }} alt="" />}>
              <Timeline className="contactTaskList">
                {taskList.map((item, index) => (
                  <Timeline.Item key={index} className="listitem">
                    <div className="contactTaskCard">
                      <Row className="taskHeader padding">
                        <Col span={12}>
                          <Row>
                            <Col span={2}>
                              <div>
                                <span style={{ background: this.getBackground(item.status) }} className="point" />
                              </div>
                            </Col>
                            <Col span={16}>
                              <span className="tasksLable">Task</span>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12}>
                          <Row style={{ textAlign: 'right' }}>
                            {item.status}
                            <span className="icontiaozhuan icon iconfont" style={{ marginLeft: '15px', cursor: 'pointer' }} onClick={() => this.redirectDetail(item.id)} />
                          </Row>
                        </Col>
                      </Row>
                      {item.showBasicInfo ? (
                        <div>
                          <Row className="padding">
                            <Col span={12}>
                              <div className="taskContactLable">
                                {' '}
                                <span className="icontaskName icon iconfont addTaskIcon" />
                                Name
                              </div>
                              <div>{item.name}</div>
                            </Col>
                            <Col span={12}>
                              <div className="taskContactLable">
                                <span className="iconxingzhuang icon iconfont addTaskIcon" />
                                Assigned to
                              </div>
                              <Tooltip
                                overlayStyle={{
                                  overflowY: 'auto'
                                }}
                                placement="bottomLeft"
                                title={<div> {item.assistantName ? item.assistantName + '(' + item.assistantEmail + ')' : ''}</div>}
                              >
                                <p style={styles.text}> {item.assistantName ? item.assistantName + '(' + item.assistantEmail + ')' : ''}</p>
                              </Tooltip>
                            </Col>
                          </Row>
                          <Row className="padding">
                            <Col span={12}>
                              <div className="taskContactLable">
                                <span className="iconshizhong icon iconfont addTaskIcon" />
                                Start Time
                              </div>
                              <div>{moment(item.startTime).format('YYYY-MM-DD')}</div>
                            </Col>
                            <Col span={12}>
                              <div className="taskContactLable">
                                <span className="iconshizhong icon iconfont addTaskIcon" />
                                Due Time
                              </div>
                              <div>{moment(item.dueTime).format('YYYY-MM-DD')}</div>
                            </Col>
                          </Row>
                          <Row className="padding">
                            <Col span={12}>
                              <div className="taskContactLable">
                                <span className="iconbianzu7 icon iconfont addTaskIcon" />
                                Golden Moment
                              </div>
                              <div>{item.goldenMoment}</div>
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                      {item.showBasicInfo ? (
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
                                <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
                              </Row>
                            </div>
                            <Row className="padding">
                              <Col span={12}>
                                <div className="taskContactLable">
                                  <span className="iconpaixu icon iconfont addTaskIcon" />
                                  Priority
                                </div>
                                <div>{item.priority}</div>
                              </Col>
                              <Col span={12}>
                                <div className="taskContactLable">
                                  <span className="iconorder icon iconfont addTaskIcon" />
                                  Action Type
                                </div>
                                <div>{item.actionType}</div>
                              </Col>
                            </Row>
                            <Row className="padding">
                              <Col span={12}>
                                <div className="taskContactLable">
                                  <span className="iconbianzu icon iconfont addTaskIcon" />
                                  Associated Pet
                                </div>
                                <Link to={{ pathname: `/petowner-details/${this.props.petOwnerId}/${item.customerAccount}`, query: { hash: 'pets-list' } }}>{item.associatedPet}</Link>
                              </Col>
                              <Col span={12}>
                                <div className="taskContactLable">
                                  <span className="iconjishiben icon iconfont addTaskIcon" />
                                  Associated Order
                                </div>
                                <Link to={`/order-detail/${item.orderCode}`}>{item.orderCode}</Link>
                              </Col>
                            </Row>
                            <Row className="padding">
                              <Col span={12}>
                                <div className="taskContactLable">
                                  <span className="iconbianzu icon iconfont addTaskIcon" />
                                  Associated Subscription
                                </div>
                                <Link to={`/subscription-detail/${item.subscriptionNumber}`}>{item.subscriptionNumber}</Link>
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
                <Button
                  type="link"
                  className="jump-link"
                  onClick={() => {
                    this.setState(
                      {
                        isAll: !this.state.isAll
                      },
                      () => this.getPetOwnerTasks()
                    );
                  }}
                >
                  <span>{isAll ? '' : 'View More'}</span>
                </Button>
              </div>
            </Spin>
          ) : (
            <Empty />
          )}
        </Col>
        {visible ? <AddComment visible={visible} getActivities={() => {}} petOwnerId={this.props.petOwnerId} closeModel={() => this.setState({ visible: false })} /> : null}
      </Row>
    );
  }
}

const styles = {
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 200,
    display: 'inline-block'
  }
};
