import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, Card } from 'antd';
import React, { Component } from 'react';
import { Const } from 'qmkit';
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
          goldenMoment: 'First purchase(order confirmation)',
          id: 1236,
          name: 'test',
          status: 'To Do'
        }
      ],
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
        toDoLength: 0
      }
    };
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
  render() {
    const { toDoList, onGoingList, completedList, cancelledList, taskCardLength } = this.state;
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
        <Row className="taskCardViewClass">
          <Col span={6}>
            <Row className="taskItem">
              {toDoList.map((item) => (
                <div className="taskCardItem">
                  <Card className="taskCard" hoverable>
                    <Row gutter={10}>
                      <Col span={24} className="contentPanel">
                        <div className="goldenMoment">
                          <span style={{ background: this.getBackground('todo') }} className={this.getGoldenMomentIcon(item.goldenMoment) + ' addTaskIcon icon iconfont'} />
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
            </Row>
          </Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
        </Row>
      </div>
    );
  }
}
