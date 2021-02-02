import { Row, Col, Input, Button } from 'antd';
import React, { Component } from 'react';

export default class Activity extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activities: [
        {
          action: 'Create',
          content: 'Task created manually',
          createdByUser: 'George Guo',
          dateTime: '2021-02-01 06:00:57',
          type: 1
        }
      ]
    };
  }
  render() {
    const { activities } = this.state;
    return (
      <div className="panel">
        {activities.map((item) => (
          <div key={item.id}>
            {item.type === 1 ? (
              <div>
                <Row>
                  <Col span={14}>
                    <span>{item.content} </span>
                  </Col>
                  <Col span={10}>
                    <span>by</span>
                    <a>{item.createdByUser}</a>
                  </Col>
                </Row>
                <Row>
                  <Col span={14}>
                    <span>{item.action} </span>
                  </Col>
                  <Col span={10}>
                    <span>{item.dateTime}</span>
                  </Col>
                </Row>
              </div>
            ) : null}

            {item.type === 0 ? (
              <div>
                <Row>
                  <Col span={14}>
                    <span>{item.createdByUser}</span>
                  </Col>
                  <Col span={10}>
                    <a>{item.dateTime}</a>
                  </Col>
                </Row>
                <Row>
                  <span>{item.content}</span>
                </Row>
              </div>
            ) : null}
          </div>
        ))}

        <Row>
          <Col span={12}>
            <Input.TextArea placeholder="Feedback" maxLength={255} rows={3} style={{ marginTop: '30px' }} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" htmlType="submit" style={{ marginTop: '20px' }}>
              Add Feedback
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
