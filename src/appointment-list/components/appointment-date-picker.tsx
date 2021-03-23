import React from 'react';
import { Const } from 'qmkit';
import { Row, Col, Calendar, Button, Tooltip, Icon, Spin } from 'antd';
import moment from 'moment';
import { getAvailabelTimeByDate } from '../webapi';

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
      loading: false,
      timeList: genTimeArr(),
      showTimePicker: false
    };
  }

  getAvailableDate = (dateStr: string, showTimePicker: boolean) => {
    this.setState({ loading: true });
    getAvailabelTimeByDate(dateStr)
      .then((data) => {
        if (data.res.code === Const.SUCCESS_CODE) {
          const appointedTime = data.res.context.appointmentVOList.filter((ap) => ap.status === 0).map((ap) => ({ hour: ap.apptTime.split('-')[0].split(':')[0], begin: ap.apptTime.split('-')[0].split(':')[1], end: ap.apptTime.split('-')[1].split(':')[1] }));
          const { timeList } = this.state;
          timeList.forEach((time) => {
            if (appointedTime.findIndex((ap) => ap.hour == time.hour && ap.begin == time.begin && ap.end == time.end) > -1) {
              time.available = false;
            } else {
              time.available = true;
            }
            time.selected = false;
          });
          this.setState({
            loading: false,
            timeList: timeList,
            showTimePicker: showTimePicker
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  onSelectDate = (date) => {
    const { value, onChange } = this.props;
    value[0] = date.format('YYYY-MM-DD');
    value[1] = '';
    if (onChange) {
      onChange(value);
    }
    this.getAvailableDate(date.format('YYYYMMDD'), true);
  };

  onSelectTime = (hour, begin, end) => {
    const { timeList } = this.state;
    const { value, onChange } = this.props;
    timeList.forEach((time) => {
      time.selected = false;
      if (time.hour === hour && time.begin === begin && time.end === end) {
        time.selected = true;
      }
    });
    value[1] = `${hour}:${begin}-${hour}:${end}`;
    this.setState({
      timeList
    });
    if (onChange) {
      onChange(value);
    }
  };

  onResetDate = () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange([moment().day() === 1 ? moment().add(1, 'days').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'), '']);
    }
    this.getAvailableDate(moment().day() === 1 ? moment().add(1, 'days').format('YYYYMMDD') : moment().format('YYYYMMDD'), false);
  };

  render() {
    const { value } = this.props;
    const { showTimePicker, timeList } = this.state;
    return (
      <Spin style={{ width: 400 }} spinning={this.state.loading} indicator={<img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '40px', height: '40px' }} alt="" />}>
        <div className="appt-date-wrapper">
          <Calendar
            fullscreen={false}
            mode="month"
            value={moment(value[0], 'YYYY-MM-DD')}
            disabledDate={(currentDate) => currentDate < moment().startOf('day') || currentDate.day() === 1}
            validRange={[moment(), moment('2021-06-13', 'YYYY-MM-DD')]}
            onSelect={this.onSelectDate}
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
                    <Button size="small" disabled={!time.available} type={time.selected ? 'primary' : 'default'} onClick={() => this.onSelectTime(time.hour, time.begin, time.end)}>{`${time.hour}:${time.begin}`}</Button>
                  </Tooltip>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Spin>
    );
  }
}
