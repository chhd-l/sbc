import React from 'react';
import { Headline, history } from 'qmkit';
import { Radio, Calendar, Button, Form, Breadcrumb, Row, Col, Input } from 'antd';
import moment from 'moment';
import CustomerList from './components/customer-list';

import './index.less';

export default class NewAppointment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      memberInfo: {},
      guestInfo: {},
      memberType: 'member'
    };
  }

  onSelectMemberType = (e) => {
    this.setState({
      memberType: e.target.value
    });
  };

  onOpenMemberModal = () => {
    this.setState({
      visible: true
    });
  };

  onCloseMemberModal = () => {
    this.setState({
      visible: false
    });
  };

  onChooseMember = (memberInfo) => {
    this.setState({
      visible: false,
      memberInfo: memberInfo
    });
  };

  onChangeGuestInfo = (field, value) => {
    this.setState({
      guestInfo: {
        ...this.state.guestInfo,
        [field]: value
      }
    });
  };

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
              <Radio.Group value={this.state.memberType} onChange={this.onSelectMemberType}>
                <Radio value="member">Member</Radio>
                <Radio value="guest">Guest</Radio>
              </Radio.Group>
              <div style={{ margin: '10px 0' }}>
                {this.state.memberType === 'member' && (
                  <Button type="primary" onClick={this.onOpenMemberModal}>
                    Select member
                  </Button>
                )}
              </div>
            </Form.Item>
            <Form.Item label="Consumer name">
              <Input disabled={this.state.memberType === 'member'} value={this.state.memberType === 'member' ? this.state.memberInfo.customerName : this.state.guestInfo.customerName} onChange={(e) => this.onChangeGuestInfo('customerName', e.target.value)} />
            </Form.Item>
            <Form.Item label="Phone number">
              <Input disabled={this.state.memberType === 'member'} value={this.state.memberType === 'member' ? this.state.memberInfo.contactPhone : this.state.guestInfo.contactPhone} onChange={(e) => this.onChangeGuestInfo('contactPhone', e.target.value)} />
            </Form.Item>
            <Form.Item label="Consumer email">
              <Input disabled={this.state.memberType === 'member'} value={this.state.memberType === 'member' ? this.state.memberInfo.email : this.state.guestInfo.email} onChange={(e) => this.onChangeGuestInfo('email', e.target.value)} />
            </Form.Item>
          </Form>
          <CustomerList visible={this.state.visible} onConfirm={this.onChooseMember} onClose={this.onCloseMemberModal} />
          <div className="bar-button">
            <Button type="primary">Save</Button>
            <Button style={{ marginLeft: 20 }} onClick={() => history.go(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
