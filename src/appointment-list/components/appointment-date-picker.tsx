import React from 'react';
import { Row, Col, Calendar, Button, Tooltip, Icon } from 'antd';
import moment from 'moment';

const genTimeArr = () => {
  let timeArr = [];
  for (let i = 10; i < 20; i++) {
    timeArr.push({ hour: i, begin: '00', end: '20', available: true, selected: false });
    timeArr.push({ hour: i, begin: '30', end: '50', available: true, selected: false });
  }
  return timeArr;
};

export default class AppointmentDatePicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      timeList: genTimeArr(),
      showTimePicker: false
    };
  }

  onSelectDate = (date) => {
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

  render() {
    const { value } = this.props;
    const { showTimePicker, timeList } = this.state;
    return (
      <div className="appt-date-wrapper">
        <Calendar
          fullscreen={false}
          mode="month"
          value={moment(value[0], 'YYYY-MM-DD')}
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
        <div className="appt-date-footer">{value.join(' ')}</div>
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
    );
  }
}
