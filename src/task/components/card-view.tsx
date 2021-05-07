import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, Card, Icon } from 'antd';
import React, { Component } from 'react';
import { Const, history } from 'qmkit';
import * as webapi from '../webapi';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
export default class CardView extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      toDoList: [],
      onGoingList: [],
      completedList: [],
      cancelledList: [],
      circleBackground: [
        { type: 'todo', color: 'rgba(233, 63, 81)' },
        { type: 'onGoing', color: 'rgba(57, 173, 255)' },
        { type: 'completed', color: 'rgba(114, 198, 127)' },
        { type: 'cancelled', color: 'rgba(172, 176, 180)' }
      ],
      goldenMomentList: [],
      taskCardLength: {
        toDoLength: 0,
        onGoingLength: 0,
        completedLength: 0,
        cancelledLength: 0
      },
      loading: false,
      formData: {},
      dragTask: {},
      maxHeight: null
    };
    this.getTaskList = this.getTaskList.bind(this);
    this.overDueStyle = this.overDueStyle.bind(this);
    this.getBackground = this.getBackground.bind(this);
    this.getGoldenMomentIcon = this.getGoldenMomentIcon.bind(this);
    this.redirectDetail = this.redirectDetail.bind(this);
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
          message.error(res.message || <FormattedMessage id="Public.GetDataFailed" />);
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
    this.getTaskList(this.props.queryType);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { formData } = nextProps;

    if (formData !== prevState.formData) {
      return {
        formData: formData
      };
    }
    return null;
  }

  getTaskList(queryType?: string) {
    const { formData } = this.state;
    let params = Object.assign(formData, {
      queryType: queryType
    });
    this.setState({
      loading: true
    });
    webapi
      .getTaskCardView(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let toDoList = res.context.toDoList ? res.context.toDoList : [];
          let onGoingList = res.context.onGoingList ? res.context.onGoingList : [];
          let completedList = res.context.completedList ? res.context.completedList : [];
          let cancelledList = res.context.cancelledList ? res.context.cancelledList : [];
          this.setState(
            {
              toDoList: toDoList,
              onGoingList: onGoingList,
              completedList: completedList,
              cancelledList: cancelledList,
              taskCardLength: {
                toDoLength: toDoList.length,
                onGoingLength: onGoingList.length,
                completedLength: completedList.length,
                cancelledLength: cancelledList.length
              },
              loading: false
            },
            () => {
              let todoHeight = document.getElementById('todoView') ? document.getElementById('todoView').offsetHeight : 0;
              let ongoingHeight = document.getElementById('ongoingView') ? document.getElementById('ongoingView').offsetHeight : 0;
              let completeHeight = document.getElementById('completeView') ? document.getElementById('completeView').offsetHeight : 0;
              let canceleight = document.getElementById('cancelView') ? document.getElementById('cancelView').offsetHeight : 0;
              let maxHeight = [todoHeight, ongoingHeight, completeHeight, canceleight].sort(function (a, b) {
                return b - a;
              });
              this.setState({
                maxHeight: maxHeight[0]
              });
            }
          );
        } else {
          message.error(res.message || <FormattedMessage id="Public.GetDataFailed" />);
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || <FormattedMessage id="Public.GetDataFailed" />);
        this.setState({
          loading: false
        });
      });
  }

  overDueStyle(item) {
    if (!item.dueTime) {
      return;
    }
    if (moment(item.dueTime) < moment(new Date())) {
      return 'rgba(239,28,51)'; // background:rgba(239,28,51);
    }
  }
  getBackground(type) {
    return this.state.circleBackground.find((x) => x.type === type).color;
  }
  getGoldenMomentIcon(goldenMoment) {
    let iconItem = this.state.goldenMomentList.find((x) => x.value === goldenMoment);
    if (!iconItem) {
      return '';
    }
    return iconItem.valueEn;
  }
  redirectDetail(id) {
    history.push('/edit-task/' + id);
  }
  handleDragStart = (e, task) => {
    this.setState({
      dragTask: task
    });
  };

  handleDrop = (e, status) => {
    const { dragTask } = this.state;
    if (dragTask.status === status) {
      return;
    }
    dragTask.status = status;
    webapi
      .updateTask(dragTask)
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success('Operate successfully');
          this.getTaskList(this.props.queryType);
        } else {
          message.error(res.message || 'Update Failed');
        }
      })
      .catch((err) => {
        message.error(err || 'Update Failed');
      });
  };
  render() {
    const { toDoList, onGoingList, completedList, cancelledList, taskCardLength, loading, maxHeight } = this.state;
    return (
      <div className="cardViewList">
        <Row gutter={20} className="taskStatusList">
          <Col span={6} className="todo">
            <Row>
              <Col span={16}>
                <span className="stick"></span>
                <h3>
                  <FormattedMessage id="task.ToDo" />
                </h3>
                <span> {taskCardLength.toDoLength} </span>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <span className="taskMore" onClick={() => this.props.clickTaskMore('To Do')}>
                  <FormattedMessage id="task.More" /> <Icon type="right" />
                </span>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="onGoing">
            <Row>
              <Col span={16}>
                <span className="stick"></span>
                <h3>
                  <FormattedMessage id="task.On-going" />
                </h3>
                <span> {taskCardLength.onGoingLength} </span>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <span className="taskMore" onClick={() => this.props.clickTaskMore('On-going')}>
                  <FormattedMessage id="task.More" /> <Icon type="right" />
                </span>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="completed">
            <Row>
              <Col span={16}>
                <span className="stick"></span>
                <h3>
                  <FormattedMessage id="task.Completed" />
                </h3>
                <span> {taskCardLength.completedLength} </span>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <span className="taskMore" onClick={() => this.props.clickTaskMore('Completed')}>
                  <FormattedMessage id="task.More" /> <Icon type="right" />
                </span>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="cancelled">
            <Row>
              <Col span={16}>
                <span className="stick"></span>
                <h3>
                  <FormattedMessage id="task.Cancelled" />
                </h3>
                <span> {taskCardLength.cancelledLength} </span>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <span className="taskMore" onClick={() => this.props.clickTaskMore('Cancelled')}>
                  <FormattedMessage id="task.More" /> <Icon type="right" />
                </span>
              </Col>
            </Row>
          </Col>
        </Row>
        <Card loading={loading} bordered={false}>
          <Row className="taskCardViewClass" gutter={10}>
            <Col span={6} style={{ height: maxHeight }} onDrop={(e) => this.handleDrop(e, 'To Do')} onDragOver={(e) => e.preventDefault()}>
              <Row className="taskItem" id="todoView">
                {toDoList.map((item) => (
                  <div className="taskCardItem" key={item.id}>
                    <Card className="taskCard" draggable={true} onDragStart={(e) => this.handleDragStart(e, item)} hoverable onClick={() => this.redirectDetail(item.id)}>
                      <Row gutter={10}>
                        <Col span={24} className="contentPanel">
                          <div className="goldenMoment">
                            <span style={{ background: this.getBackground('todo') }} className="point" />
                            <span>{item.name}</span>
                            {item.priority === 'High' ? <span className="icon iconfont iconIII warningIcon high" /> : null}
                            {item.priority === 'Medium' ? <span className="icon iconfont iconII warningIcon medium" /> : null}
                            {item.priority === 'Low' ? <span className="icon iconfont iconI warningIcon low" /> : null}
                          </div>
                          <div className="contentInfo">
                            <span className="icon iconfont addTaskIcon icontaskName" />
                            {item.goldenMoment}
                          </div>
                          <div className="contentInfo">
                            <span className=" icon iconfont addTaskIcon iconsingle-person" />
                            {item.assistantName ? item.assistantName : 'No Assistant Name'}
                          </div>
                          <div style={{ color: this.overDueStyle(item) }} className="contentInfo">
                            <span className="icon iconfont addTaskIcon iconshizhong" />
                            {item.dueTime ? item.dueTime : 'No Due Time'}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                ))}
              </Row>
            </Col>
            <Col span={6} style={{ height: maxHeight }} onDrop={(e) => this.handleDrop(e, 'On-going')} onDragOver={(e) => e.preventDefault()}>
              <Row className="taskItem" id="ongoingView">
                {onGoingList.map((item) => (
                  <div className="taskCardItem" key={item.id}>
                    <Card className="taskCard" draggable={true} onDragStart={(e) => this.handleDragStart(e, item)} hoverable onClick={() => this.redirectDetail(item.id)}>
                      <Row gutter={10}>
                        <Col span={24} className="contentPanel">
                          <div className="goldenMoment">
                            <span style={{ background: this.getBackground('onGoing') }} className="point" />
                            {item.name}
                            {item.priority === 'High' ? <span className="icon iconfont iconIII warningIcon high" /> : null}
                            {item.priority === 'Medium' ? <span className="icon iconfont iconII warningIcon medium" /> : null}
                            {item.priority === 'Low' ? <span className="icon iconfont iconI warningIcon low" /> : null}
                          </div>
                          <div className="contentInfo">
                            <span className="icon iconfont addTaskIcon icontaskName" />
                            {item.goldenMoment}
                          </div>
                          <div className="contentInfo">
                            <span className=" icon iconfont addTaskIcon iconsingle-person" />
                            {item.assistantName ? item.assistantName : 'No Assistant Name'}
                          </div>
                          <div style={{ color: this.overDueStyle(item) }} className="contentInfo">
                            <span className="icon iconfont addTaskIcon iconshizhong" />
                            {item.dueTime ? item.dueTime : 'No Due Time'}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                ))}
              </Row>
            </Col>
            <Col span={6} style={{ height: maxHeight }} onDrop={(e) => this.handleDrop(e, 'Completed')} onDragOver={(e) => e.preventDefault()}>
              <Row className="taskItem" id="completeView">
                {completedList.map((item) => (
                  <div className="taskCardItem" key={item.id}>
                    <Card className="taskCard" draggable={true} onDragStart={(e) => this.handleDragStart(e, item)} hoverable onClick={() => this.redirectDetail(item.id)}>
                      <Row gutter={10}>
                        <Col span={24} className="contentPanel">
                          <div className="goldenMoment">
                            <span style={{ background: this.getBackground('completed') }} className="point" />
                            {item.name}
                            {item.priority === 'High' ? <span className="icon iconfont iconIII warningIcon high" /> : null}
                            {item.priority === 'Medium' ? <span className="icon iconfont iconII warningIcon medium" /> : null}
                            {item.priority === 'Low' ? <span className="icon iconfont iconI warningIcon low" /> : null}
                          </div>
                          <div className="contentInfo">
                            <span className="icon iconfont addTaskIcon icontaskName" />
                            {item.goldenMoment}
                          </div>
                          <div className="contentInfo">
                            <span className=" icon iconfont addTaskIcon iconsingle-person" />
                            {item.assistantName ? item.assistantName : 'No Assistant Name'}
                          </div>
                          <div className="contentInfo">
                            <span className="icon iconfont addTaskIcon iconshizhong" />
                            {item.dueTime ? item.dueTime : 'No Due Time'}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                ))}
              </Row>
            </Col>
            <Col span={6} style={{ height: maxHeight }} onDrop={(e) => this.handleDrop(e, 'Cancelled')} onDragOver={(e) => e.preventDefault()}>
              <Row className="taskItem" id="cancelView">
                {cancelledList.map((item) => (
                  <div className="taskCardItem" key={item.id}>
                    <Card className="taskCard" draggable={true} onDragStart={(e) => this.handleDragStart(e, item)} hoverable onClick={() => this.redirectDetail(item.id)}>
                      <Row gutter={10}>
                        <Col span={24} className="contentPanel">
                          <div className="goldenMoment">
                            <span style={{ background: this.getBackground('cancelled') }} className="point" />
                            {item.name}
                            {item.priority === 'High' ? <span className="icon iconfont iconIII warningIcon high" /> : null}
                            {item.priority === 'Medium' ? <span className="icon iconfont iconII warningIcon medium" /> : null}
                            {item.priority === 'Low' ? <span className="icon iconfont iconI warningIcon low" /> : null}
                          </div>
                          <div className="contentInfo">
                            <span className="icon iconfont addTaskIcon icontaskName" />
                            {item.goldenMoment}
                          </div>
                          <div className="contentInfo">
                            <span className="icon iconfont addTaskIcon iconsingle-person" />
                            {item.assistantName ? item.assistantName : 'No Assistant Name'}
                          </div>
                          <div className="contentInfo">
                            <span className="icon iconfont addTaskIcon iconshizhong" />
                            {item.dueTime ? item.dueTime : 'No Due Time'}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                ))}
              </Row>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
