import React from 'react';
import { Headline, history } from 'qmkit';
import { Radio, Calendar, Button, Form, Breadcrumb, Row, Col, Input, Tooltip, Icon, Spin } from 'antd';
import moment from 'moment';
import CustomerList from './components/customer-list';
import { getAvailabelTimeByDate, addNewAppointment } from './webapi';

import './index.less';

const genTimeArr = () => {
  let timeArr = [];
  for (let i = 10; i < 20; i++) {
    timeArr.push({ hour: i, begin: '00', end: '20', available: true, selected: false });
    timeArr.push({ hour: i, begin: '30', end: '50', available: true, selected: false });
  }
  return timeArr;
};

export default class NewAppointment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      selectedDate: [moment().day() === 1 ? moment().add(1, 'days').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'), ''],
      showTimePicker: false,
      timeList: genTimeArr(),
      memberInfo: {},
      guestInfo: {},
      memberType: 'member'
    };
  }

  onSelectDate = (date) => {
    getAvailabelTimeByDate(date.format('YYYYMMDD')).then((data) => {});
    this.setState({
      selectedDate: [date.format('YYYY-MM-DD'), ''],
      showTimePicker: true
    });
  };

  onSelectTime = (hour, begin) => {
    const { timeList, selectedDate } = this.state;
    timeList.forEach((time) => {
      time.selected = false;
      if (time.hour === hour && time.begin === begin) {
        time.selected = true;
      }
    });
    selectedDate[1] = `${hour}:${begin}`;
    this.setState({
      timeList,
      selectedDate
    });
  };

  onResetDate = () => {
    this.setState({
      selectedDate: [moment().day() === 1 ? moment().add(1, 'days').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'), ''],
      timeList: genTimeArr(),
      showTimePicker: false
    });
  };

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

  onSaveAppointment = () => {
    const {};
  };

  render() {
    const { selectedDate, showTimePicker, timeList } = this.state;
    return (
      <Spin spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px', height: '90px', position: 'fixed', marginLeft: '5%' }} alt="" />}>
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
              <div className="appt-date-wrapper">
                <Calendar
                  fullscreen={false}
                  mode="month"
                  value={moment(selectedDate[0], 'YYYY-MM-DD')}
                  disabledDate={(currentDate) => currentDate < moment().startOf('day') || currentDate.day() === 1}
                  validRange={[moment(), moment('2021-06-13', 'YYYY-MM-DD')]}
                  onChange={this.onSelectDate}
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
                <div className="appt-date-footer">{selectedDate.join(' ')}</div>
                <div className={`appt-time-wrapper ${showTimePicker ? 'show' : ''}`}>
                  <Row>
                    <Col span={12} offset={6} style={{ textAlign: 'center' }}>
                      <Icon type="caret-up" />
                    </Col>
                    <Col span={6}>
                      <Button type="link" onClick={this.onResetDate}>
                        <Icon type="sync" /> Reset
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    {timeList.map((time, idx) => (
                      <Col style={{ textAlign: 'center' }} key={idx} span={6}>
                        <Tooltip title={`${time.hour}:${time.begin}-${time.hour}:${time.end}`} trigger="hover">
                          <Button size="small" disabled={!time.available} type={time.selected ? 'primary' : 'default'} onClick={() => this.onSelectTime(time.hour, time.begin)}>{`${time.hour}:${time.begin}`}</Button>
                        </Tooltip>
                      </Col>
                    ))}
                  </Row>
                </div>
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
      </Spin>
    );
  }
}
