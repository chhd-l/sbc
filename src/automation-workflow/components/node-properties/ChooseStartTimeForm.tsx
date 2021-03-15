import React, { Component } from 'react';
import ChooseRecurrenceDailyForm from './start-components/ChooseRecurrenceDailyForm';
import ChooseRecurrenceWeeklyForm from './start-components/ChooseRecurrenceWeeklyForm';
import ChooseRecurrenceMonthlyForm from './start-components/ChooseRecurrenceMonthlyForm';
import ChooseRecurrenceYearlyForm from './start-components/ChooseRecurrenceYearlyForm';
import moment from 'moment';
import { Form, Row, Col, Input, Radio, TimePicker, DatePicker } from 'antd';

const FormItem = Form.Item;

export default class ChooseStartTimeForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        recurrenceType: '', // daily weekly monthly yearly
        timeType: '', // immediately recurrence specificTime
        specificTime: null, // yyyy-mm-dd
        endInfo: null
      },
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onTimePickerChange = this.onTimePickerChange.bind(this);
    this.updateEndInfo = this.updateEndInfo.bind(this);
    this.updateParentValue = this.updateParentValue.bind(this);
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData(nextProps) {
    if (this.state.nodeId === nextProps.nodeId) {
      return;
    } else {
      this.setState({
        nodeId: nextProps.nodeId
      });
    }
    const { startCampaignTime } = nextProps;
    if (startCampaignTime && startCampaignTime.recurrenceType !== '') {
      this.setState({
        form: {
          timeType: startCampaignTime.timeType,
          recurrenceType: startCampaignTime.recurrenceType,
          specificTime: startCampaignTime.time,
          endInfo: startCampaignTime.recurrenceValue
        }
      });
    } else {
      this.setState({
        form: {
          recurrenceType: '',
          timeType: '',
          specificTime: null,
          endInfo: null
        }
      });
    }
  }

  onChange(field, value) {
    let data = this.state.form;
    data[field] = value;
    this.setState(
      {
        form: data
      },
      () => this.updateParentValue()
    );
  }

  updateParentValue() {
    const { updateValue } = this.props;
    const { form } = this.state;
    const params = { timeType: form.timeType, time: '', recurrenceType: '', recurrenceValue: '' };
    switch (form.timeType) {
      case 'specificTime':
        params.time = form.specificTime;
        break;
      case 'recurrence':
        params.recurrenceType = form.recurrenceType;
        params.recurrenceValue = form.endInfo;
        break;
    }
    updateValue('startCampaignTime', params);
  }

  onTimePickerChange(time, timeString) {
    const { form } = this.state;
    form.endInfo = form.endInfo || {};
    form.endInfo.pointTime = timeString;
    form.timeType = 'recurrence';
    this.setState(
      {
        form
      },
      () => this.updateParentValue()
    );
  }

  updateEndInfo(data) {
    const { form } = this.state;
    const tmp = { pointTime: form.endInfo && form.endInfo.pointTime ? form.endInfo.pointTime : '' };
    form.endInfo = Object.assign({}, tmp, data);
    this.setState(
      {
        form
      },
      () => this.updateParentValue()
    );
  }
  render() {
    const { form } = this.state;
    const { startCampaignTime } = this.props;
    let momentedSpecificTime = form && form.specificTime ? moment(form.specificTime) : null;
    let momentedPointTime = form && form.endInfo && form.endInfo.pointTime ? moment(form.endInfo.pointTime, 'HH:mm:ss') : null;
    return (
      <React.Fragment>
        <FormItem label="Choose when to start campaign" colon={false}>
          <Row gutter={24} className="ui-radio-group-custom">
            <Radio.Group
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onChange('timeType', value);
                if (value !== 'specificTime') {
                  this.onChange('specificTime', null);
                }
                if (value !== 'recurrence') {
                  this.onChange('recurrenceType', '');
                  this.onChange('endInfo', null);
                }
              }}
              value={form.timeType}
            >
              <Col span={24}>
                <Radio value="immediately">Immediately</Radio>
              </Col>
              <Col span={24}>
                <Radio value="recurrence">
                  Recurrence at {'  '}
                  <TimePicker value={momentedPointTime} use12Hours onChange={this.onTimePickerChange} />
                </Radio>
              </Col>
              <Col span={23} push={1}>
                <Row type="flex" justify="start" className="ui-border">
                  <Col span={6} push={1}>
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        if (!startCampaignTime.recurrenceValue) {
                          this.onChange('endInfo', null);
                        }
                        this.onChange('recurrenceType', value);
                        this.onChange('timeType', 'recurrence');
                        this.onChange('endInfo', null);
                      }}
                      value={form.recurrenceType}
                    >
                      <Radio value="daily">Daily</Radio>
                      <Radio value="weekly">Weekly</Radio>
                      <Radio value="monthly">Monthly</Radio>
                      <Radio value="yearly">Yearly</Radio>
                    </Radio.Group>
                  </Col>
                  {form.recurrenceType ? (
                    <Col span="16" push={1} className="ui-border-left">
                      <Row gutter={24}>
                        <Col span="23" push={1}>
                          {form.recurrenceType === 'daily' ? <ChooseRecurrenceDailyForm endInfo={form.endInfo} updateEndInfo={this.updateEndInfo} /> : null}
                          {form.recurrenceType === 'weekly' ? <ChooseRecurrenceWeeklyForm endInfo={form.endInfo} updateEndInfo={this.updateEndInfo} /> : null}
                          {form.recurrenceType === 'monthly' ? <ChooseRecurrenceMonthlyForm endInfo={form.endInfo} updateEndInfo={this.updateEndInfo} /> : null}
                          {form.recurrenceType === 'yearly' ? <ChooseRecurrenceYearlyForm endInfo={form.endInfo} updateEndInfo={this.updateEndInfo} /> : null}
                        </Col>
                      </Row>
                    </Col>
                  ) : null}
                </Row>
              </Col>
              <Col span={24}>
                <Radio value="specificTime">At a specific date/time</Radio>
              </Col>
              <Col span={24} push={1}>
                <DatePicker
                  showTime
                  placeholder="Select Time"
                  onChange={(value, dateString) => {
                    this.onChange('specificTime', dateString);
                    this.onChange('timeType', 'specificTime');
                    this.onChange('recurrenceType', '');
                    this.onChange('endInfo', null);
                  }}
                  value={momentedSpecificTime}
                />
              </Col>
            </Radio.Group>
          </Row>
        </FormItem>
      </React.Fragment>
    );
  }
}
