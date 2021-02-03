import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, Card } from 'antd';
import React, { Component } from 'react';
import { Const, history } from 'qmkit';
import * as webapi from '../webapi';
import moment from 'moment';

export default class CardView extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      toDoList: [
        {
          assistantEmail: 'george.guo@effem.com',
          assistantName: 'George Guo',
          dueTime: '2021-02-18',
          goldenMoment: 'Subscription program cancelation by PO',
          id: 1236,
          name: 'test',
          status: 'To Do',
          priority: 'high'
        }
      ],
      onGoingList: [
        {
          assistantEmail: 'george.guo@effem.com',
          assistantName: 'George Guo',
          dueTime: '2021-02-18',
          goldenMoment: 'First delivery with Welcome-pack',
          id: 1237,
          name: 'test',
          status: 'On-going'
        }
      ],
      completedList: [
        {
          assistantEmail: 'george.guo@effem.com',
          assistantName: 'George Guo',
          dueTime: '2021-02-18',
          goldenMoment: 'Half Year subscription',
          id: 1237,
          name: 'test',
          status: 'Completed'
        }
      ],
      cancelledList: [
        {
          assistantEmail: 'george.guo@effem.com',
          assistantName: 'George Guo',
          dueTime: '2021-02-18',
          goldenMoment: 'First month of Subscription',
          id: 1237,
          name: 'test',
          status: 'Cancelled'
        }
      ],
      circleBackground: [
        { type: 'todo', color: 'rgba(233, 63, 81)' },
        { type: 'onGoing', color: 'rgba(57, 173, 255)' },
        { type: 'completed', color: 'rgba(114, 198, 127)' },
        { type: 'cancelled', color: 'rgba(172, 176, 180)' }
      ],
      goldenMomentList: [],
      taskCardLength: {
        toDoLength: 1,
        onGoingLength: 1,
        completedLength: 1,
        cancelledLength: 1
      },
      loading: false,
      formData: {}
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
          this.getTaskList(this.state.queryType);
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
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
          this.setState({
            toDoList: res.context.toDoList,
            onGoingList: res.context.onGoingList,
            completedList: res.context.completedList,
            cancelledList: res.context.cancelledList,
            taskCardLength: {
              toDoLength: res.context.toDoList.length,
              onGoingLength: res.context.onGoingList.length,
              completedLength: res.context.completedList.length,
              cancelledLength: res.context.cancelledList.length
            },
            loading: false
          });
        } else {
          message.error(res.message || 'Get Data Failed');
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        message.error(err || 'Get Data Failed');
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
  render() {
    const { toDoList, onGoingList, completedList, cancelledList, taskCardLength, loading } = this.state;
    return (
      <div className="cardViewList">
        <Row gutter={20} className="taskStatusList">
          <Col span={6} className="todo">
            <span className="stick"></span>
            <h3>TO DO</h3>
            <span> {taskCardLength.toDoLength} </span>
          </Col>
          <Col span={6} className="onGoing">
            <span className="stick"></span>
            <h3>ON-GOING</h3>
            <span> {taskCardLength.onGoingLength} </span>
          </Col>
          <Col span={6} className="completed">
            <span className="stick"></span>
            <h3>COMPLETED</h3>
            <span> {taskCardLength.completedLength} </span>
          </Col>
          <Col span={6} className="cancelled">
            <span className="stick"></span>
            <h3>CANCELLED</h3>
            <span> {taskCardLength.cancelledLength} </span>
          </Col>
        </Row>
        <Card loading={loading} bordered={false}>
          <Row className="taskCardViewClass" gutter={10}>
            <Col span={6}>
              <Row className="taskItem">
                {toDoList.map((item) => (
                  <div className="taskCardItem">
                    <Card className="taskCard" hoverable onClick={() => this.redirectDetail(item.id)}>
                      <Row gutter={10}>
                        <Col span={24} className="contentPanel">
                          <div className="goldenMoment">
                            <span style={{ background: this.getBackground('todo') }} className={this.getGoldenMomentIcon(item.goldenMoment) + ' addTaskIcon icon iconfont'} />
                            <span>{item.goldenMoment}</span>
                            {item.priority === 'high' ? <span className="icon iconfont iconwarning warningIcon" /> : null}
                          </div>
                          <div className="contentInfo">
                            <span className="icon iconfont addTaskIcon icontaskName" />
                            {item.name}
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
            <Col span={6}>
              {onGoingList.map((item) => (
                <div className="taskCardItem">
                  <Card className="taskCard" hoverable onClick={() => this.redirectDetail(item.id)}>
                    <Row gutter={10}>
                      <Col span={24} className="contentPanel">
                        <div className="goldenMoment">
                          <span style={{ background: this.getBackground('onGoing') }} className={this.getGoldenMomentIcon(item.goldenMoment) + ' addTaskIcon icon iconfont'} />
                          {item.goldenMoment}
                          {item.priority === 'high' ? <span className="icon iconfont iconwarning warningIcon" /> : null}
                        </div>
                        <div className="contentInfo">
                          <span className="icon iconfont addTaskIcon icontaskName" />
                          {item.name}
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
            </Col>
            <Col span={6}>
              {completedList.map((item) => (
                <div className="taskCardItem">
                  <Card className="taskCard" hoverable onClick={() => this.redirectDetail(item.id)}>
                    <Row gutter={10}>
                      <Col span={24} className="contentPanel">
                        <div className="goldenMoment">
                          <span style={{ background: this.getBackground('completed') }} className={this.getGoldenMomentIcon(item.goldenMoment) + ' addTaskIcon icon iconfont'} />
                          {item.goldenMoment}
                          {item.priority === 'high' ? <span className="icon iconfont iconwarning warningIcon" /> : null}
                        </div>
                        <div className="contentInfo">
                          <span className="icon iconfont addTaskIcon icontaskName" />
                          {item.name}
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
            </Col>
            <Col span={6}>
              {cancelledList.map((item) => (
                <div className="taskCardItem">
                  <Card className="taskCard" hoverable onClick={() => this.redirectDetail(item.id)}>
                    <Row gutter={10}>
                      <Col span={24} className="contentPanel">
                        <div className="goldenMoment">
                          <span style={{ background: this.getBackground('cancelled') }} className={this.getGoldenMomentIcon(item.goldenMoment) + ' addTaskIcon icon iconfont'} />
                          {item.goldenMoment}
                          {item.priority === 'high' ? <span className="icon iconfont iconwarning warningIcon" /> : null}
                        </div>
                        <div className="contentInfo">
                          <span className="icon iconfont addTaskIcon icontaskName" />
                          {item.name}
                        </div>
                        <div className="contentInfo">
                          <span className="icon iconfont addTaskIcon iconsingle-person" />
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
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
