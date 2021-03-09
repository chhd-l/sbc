import React, { Component } from 'react';
import ChooseRecurrenceDailyForm from './start-components/ChooseRecurrenceDailyForm';
import ChooseRecurrenceWeeklyForm from './start-components/ChooseRecurrenceWeeklyForm';
import ChooseRecurrenceMonthlyForm from './start-components/ChooseRecurrenceMonthlyForm';
import ChooseRecurrenceYearlyForm from './start-components/ChooseRecurrenceYearlyForm';
import moment from 'moment';
import { Form, Row, Col, Input, Radio, TimePicker, DatePicker } from 'antd';
import value from '*.json';

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
      }
    };
    this.onChange = this.onChange.bind(this);
    this.onTimePickerChange = this.onTimePickerChange.bind(this);
    this.updateEndInfo = this.updateEndInfo.bind(this);
  }

  componentDidMount() {
    const { startCampaignTime } = this.props;
    if (startCampaignTime) {
      this.setState({
        form: {
          timeType: startCampaignTime.timeType,
          recurrenceType: startCampaignTime.recurrenceType,
          specificTime: startCampaignTime.time,
          endInfo: startCampaignTime.recurrenceValue
        }
      });
    }
  }

  onChange(value) {
    const { updateValue } = this.props;
    updateValue('eventType', value);
  }
  onTimePickerChange(time, timeString) {
    this.setState({
      endInfo: {
        pointTime: timeString
      }
    });
  }
  updateEndInfo(data) {
    const { form } = this.state;
    const tmp = { pointTime: form.endInfo && form.endInfo.pointTime ? form.endInfo.pointTime : '' };
    this.setState({
      form: {
        endInfo: Object.assign({}, tmp, data)
      }
    });
  }
  render() {
    const { form } = this.state;
    let momentedSpecificTime = form && form.specificTime ? moment(form.specificTime) : null;
    return (
      <React.Fragment>
        <FormItem label="Choose when to start campaign" colon={false}>
          <Row gutter={24} className="ui-radio-group-custom">
            <Radio.Group v-model="form.timeType">
              <Col span={24}>
                <Radio value="immediately">Immediately</Radio>
              </Col>
              <Col span={24}>
                <Radio value="recurrence">
                  Recurrence at {'  '}
                  <TimePicker use12Hours onChange={this.onTimePickerChange} />
                </Radio>
              </Col>
              <Col span={23} push={1}>
                <Row type="flex" justify="start" className="ui-border">
                  <Col span={6} push={1}>
                    <Radio.Group
                      onChange={(e) => {
                        const value = (e.target as any).value;
                        this.setState({ form: { recurrenceType: value } });
                      }}
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
                          {form.recurrenceType === 'daily' ? <ChooseRecurrenceDailyForm recurrenceType="daily" key={1} endInfo={form.endInfo} updateValue={this.updateEndInfo} /> : null}
                          {form.recurrenceType === 'weekly' ? <ChooseRecurrenceWeeklyForm recurrenceType="weekly" key={2} endInfo={form.endInfo} updateValue={this.updateEndInfo} /> : null}
                          {form.recurrenceType === 'monthly' ? <ChooseRecurrenceMonthlyForm recurrenceType="monthly" key={3} endInfo={form.endInfo} updateValue={this.updateEndInfo} /> : null}
                          {form.recurrenceType === 'yearly' ? <ChooseRecurrenceYearlyForm recurrenceType="yearly" key={4} endInfo={form.endInfo} updateValue={this.updateEndInfo} /> : null}
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
                  defaultValue={momentedSpecificTime}
                  onChange={(value, dateString) => {
                    this.setState({
                      specificTime: dateString
                    });
                  }}
                />
              </Col>
            </Radio.Group>
          </Row>
        </FormItem>
      </React.Fragment>
    );
  }
}
