import { Row, Col, Input, Button, Form, message } from 'antd';
import React, { Component } from 'react';
import * as webapi from '../webapi';
import { Const } from 'qmkit';

const FormItem = Form.Item;

export default class Activity extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      feedback: ''
    };
    this.getFeedbacks = this.getFeedbacks.bind(this);
    this.addFeedback = this.addFeedback.bind(this);
  }

  componentDidMount() {
    this.getFeedbacks();
  }

  getFeedbacks() {
    let taskId = this.props.taskId;
    webapi
      .getTaskLogsById(taskId)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            activities: res.context.taskLogList.reverse()
          });
        } else {
          message.error(res.message || 'Get data failed');
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }

  addFeedback(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        const { feedback } = this.state;
        let taskId = this.props.taskId;
        webapi
          .createTaskLog({ taskId: taskId, content: feedback })
          .then((data) => {
            const { res } = data;
            if (res.code === 'K-000000') {
              message.success('Operate successfully');
              this.getFeedbacks();
            } else {
              message.error(res.message || 'Add Failed');
            }
          })
          .catch((err) => {
            message.error(err || 'Add Failed');
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { activities } = this.state;
    return (
      <div className="panel">
        {activities.map((item, index) => (
          <div key={item.id}>
            {item.type === 1 ? (
              <div className="log" key={index}>
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
                    <span>{item.dateAdded}</span>
                  </Col>
                </Row>
              </div>
            ) : null}

            {item.type === 0 ? (
              <div className="log" key={index}>
                <Row>
                  <Col span={14}>
                    <span>{item.createdByUser}</span>
                  </Col>
                  <Col span={10}>
                    <a>{item.dateAdded}</a>
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
          <Col span={18}>
            <Form>
              <FormItem>
                {getFieldDecorator('feedback', {
                  rules: [{ required: true, message: 'Please input feedback' }]
                })(
                  <Input.TextArea
                    disabled={this.props.taskCompleted}
                    onChange={(e) => {
                      this.setState({ feedback: (e.target as any).value });
                    }}
                    placeholder="Feedback"
                    maxLength={255}
                    rows={3}
                    style={{ marginTop: '30px' }}
                  />
                )}
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={this.addFeedback} htmlType="submit" style={{ marginTop: '20px' }}>
              Add Feedback
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
