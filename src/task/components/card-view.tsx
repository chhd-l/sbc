import { Form, Row, Col, Select, Input, Button, message, Tooltip, Table, Card } from 'antd';
import React, { Component } from 'react';
import * as webapi from '../webapi';

export default class CardView extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      toDoList: [],
      onGoingList: [],
      completedList: [],
      cancelledList: []
    };
  }
  render() {
    return (
      <div>
        <Row className="taskCardViewClass">
          <Col span={6}>
            <Row className="taskItem">
              <div className="taskCardItem">
                <Card className="taskCard" />
              </div>
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
