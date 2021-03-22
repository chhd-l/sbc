import React from 'react';
import { Headline } from 'qmkit';
import { Radio, Calendar, Button, Form, Breadcrumb, Row, Col } from 'antd';
import moment from 'moment';

import './index.less';

export default class NewAppointment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/appointment-list">Appointment list</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New appointment</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container">
          <Headline title="Create new appointment" />
          <Form wrapperCol={{ sm: { span: 16 } }} labelCol={{ sm: { span: 4 } }}>
            <Form.Item label="Select appointment type">
              <Radio.Group defaultValue="offline">
                <Radio value="offline">Offline</Radio>
                <Radio value="online">Online</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Select appointment time">
              <div style={{ width: 400, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                <Calendar
                  fullscreen={false}
                  mode="month"
                  disabledDate={(currentDate) => currentDate < moment().startOf('day') || currentDate.day() === 1}
                  validRange={[moment(), moment('2021-06-13', 'YYYY-MM-DD')]}
                  headerRender={({ value, type, onChange, onTypeChange }) => {
                    return (
                      <Row type="flex" justify="space-between" gutter={20}>
                        <Col>
                          <Button type="link" size="small" icon="left" onClick={() => onChange(value.clone().subtract(1, 'month'))} />
                        </Col>
                        <Col>{value.format('YYYY-MM')}</Col>
                        <Col>
                          <Button type="link" size="small" icon="right" onClick={() => onChange(value.clone().add(1, 'month'))} />
                        </Col>
                      </Row>
                    );
                  }}
                  dateFullCellRender={(date) => <a className={`customer-date-field ${date < moment().startOf('day') || date.day() === 1 ? 'disabled' : ''}`}>{date.format('DD')}</a>}
                />
              </div>
            </Form.Item>
            <Form.Item label="Consumer information">
              <Radio.Group defaultValue="member">
                <Radio value="member">Member</Radio>
                <Radio value="guest">Guest</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
          <div className="bar-button">
            <Button type="primary">Save</Button>
            <Button style={{ marginLeft: 20 }}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }
}
