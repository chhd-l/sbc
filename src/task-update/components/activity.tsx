import { Row, Col, Input, Button, Form, message, Tooltip } from 'antd';
import React, { Component } from 'react';
import * as webapi from '../webapi';
import { Const } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';

const FormItem = Form.Item;

@injectIntl
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
          message.error(res.message || <FormattedMessage id="Public.GetDataFailed" />);
        }
      })
      .catch(() => {
        message.error('Get data failed');
      });
  }

  addFeedback(e) {
    e.preventDefault();
    const { feedback } = this.state;
    let taskId = this.props.taskId;
    webapi
      .createTaskLog({ taskId: taskId, content: feedback, type: 0 })
      .then((data) => {
        const { res } = data;
        if (res.code === 'K-000000') {
          message.success(<FormattedMessage id="Order.OperateSuccessfully" />);
          this.setState({ feedback: '' });
          this.getFeedbacks();
        } else {
          message.error(res.message || <FormattedMessage id="Order.AddFailed" />);
        }
      })
      .catch((err) => {
        message.error(err || <FormattedMessage id="Order.AddFailed" />);
      });
  }

  render() {
    const { activities, feedback } = this.state;
    return (
      <div className="panel">
        {activities.map((item, index) => (
          <div key={item.id}>
            <div className="log" key={index}>
              <Row>
                <Col span={14}>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{item.content}</div>}
                  >
                    <p className="overFlowtext">{item.content}</p>
                  </Tooltip>
                </Col>
                <Col span={10}>
                  <span>
                    <FormattedMessage id="task.By" />
                  </span>
                  <a>{item.createdByUser}</a>
                </Col>
              </Row>
              <Row>
                <Col span={14}>
                  <span>{item.type === 0 ? item.action : (window as any).RCi18n({ id: 'task.Feedback' })} </span>
                </Col>
                <Col span={10}>
                  <span>{item.dateAdded}</span>
                </Col>
              </Row>
            </div>
          </div>
        ))}

        <Row>
          <Col span={18}>
            <Form>
              <FormItem>
                <Input.TextArea
                  disabled={this.props.taskCompleted}
                  onChange={(e) => {
                    this.setState({ feedback: (e.target as any).value });
                  }}
                  placeholder={(window as any).RCi18n({ id: 'task.Feedback' })}
                  maxLength={255}
                  rows={3}
                  style={{ marginTop: '30px' }}
                  value={feedback}
                />
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button type="primary" disabled={feedback === '' || this.props.taskCompleted} onClick={this.addFeedback} htmlType="submit" style={{ marginTop: '20px' }}>
              <FormattedMessage id="task.AddFeedback" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
