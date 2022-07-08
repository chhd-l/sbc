import React, { Component } from 'react';
import ChooseRecurrenceDailyForm from './start-components/ChooseRecurrenceDailyForm';
import ChooseRecurrenceWeeklyForm from './start-components/ChooseRecurrenceWeeklyForm';
import ChooseRecurrenceMonthlyForm from './start-components/ChooseRecurrenceMonthlyForm';
import ChooseRecurrenceYearlyForm from './start-components/ChooseRecurrenceYearlyForm';
import moment from 'moment';
import { Form, Row, Col, Input, Radio, TimePicker, DatePicker } from 'antd';

const FormItem = Form.Item;
let id = 0;

type ChooseStartTimeFormState = {
  form: {
    recurrenceType: string;
    timeType: string;
    specificTime: { sort: number; specificTime: string | null }[];
    endInfo: any;
  };
  nodeId: string;
};
export default class ChooseStartTimeForm extends Component<any, ChooseStartTimeFormState> {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        recurrenceType: '', // daily weekly monthly yearly
        timeType: '', // immediately recurrence specificTime
        specificTime: [{ sort: id, specificTime: null }], // yyyy-mm-dd
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
    if (startCampaignTime.timeType === undefined) {
      this.setState({
        form: {
          recurrenceType: '',
          timeType: '',
          specificTime: [{ sort: id++, specificTime: null }],
          endInfo: null
        }
      });
    } else {
      const specificTimeList = startCampaignTime.time
        .split(',')
        .map((i) => ({ sort: id++, specificTime: i }));
      this.setState({
        form: {
          timeType: startCampaignTime.timeType,
          recurrenceType: startCampaignTime.recurrenceType,
          specificTime: specificTimeList,
          endInfo: startCampaignTime.recurrenceValue
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
    const params = {
      timeType: form.timeType,
      time: '',
      recurrenceType: '',
      recurrenceValue: '',
      specificTime: ''
    };
    switch (form.timeType) {
      case 'specificTime':
        params.time = form.specificTime
          ?.filter((timeItem) => timeItem.specificTime)
          .map((timeItem) => timeItem.specificTime)
          .join(',');
      case 'recurrence':
        params.recurrenceType = form.recurrenceType;
        params.recurrenceValue = form.endInfo;
        break;
    }

    updateValue('startCampaignTime', params);
  }

  onTimePickerChange(_, timeString) {
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
  specificTimeAdd = () => {
    const {
      form: { specificTime }
    } = this.state;
    const specificTimeList = [...specificTime, { sort: id++, specificTime: null }];
    this.onChange('specificTime', specificTimeList);
  };

  specificTimeDel(index) {
    const {
      form: { specificTime }
    } = this.state;
    const specificTimeList = specificTime.filter((i) => i.sort !== index);
    this.onChange('specificTime', specificTimeList);
  }
  specificTimeChange(sort, dateString) {
    const {
      form: { specificTime }
    } = this.state;
    const specificTimeList = specificTime.map((specificTimeItem) => {
      if (specificTimeItem.sort === sort) {
        return { ...specificTimeItem, specificTime: dateString };
      }
      return specificTimeItem;
    });
    this.onChange('specificTime', specificTimeList);
  }
  renderSpecificTimeList = () => {
    if (this.state.form.timeType !== 'specificTime') return null;
    const { form } = this.state;
    return form.specificTime?.map((item) => (
      <Row key={item.sort}>
        <DatePicker
          showTime
          placeholder="Select Time"
          onChange={(_, dateString) => {
            this.onChange('timeType', 'specificTime');
            this.onChange('recurrenceType', '');
            this.onChange('endInfo', null);
            this.specificTimeChange(item.sort, dateString);
          }}
          value={item.specificTime ? moment(item.specificTime) : null}
        />
        {form.specificTime?.length < 10 && (
          <a
            className="iconfont iconjia"
            style={{ marginLeft: '20px', fontSize: '20px' }}
            onClick={this.specificTimeAdd}
          ></a>
        )}
        {form.specificTime?.length > 1 && (
          <a
            className="iconfont iconjian2"
            style={{
              marginLeft: '5px',
              fontSize: '20px',
              color: 'rgba(0, 0, 0, 0.65)'
            }}
            onClick={() => this.specificTimeDel(item.sort)}
          ></a>
        )}
      </Row>
    ));
  };
  render() {
    const { form } = this.state;
    console.log(form, 'formformformformformform');

    const { startCampaignTime } = this.props;
    let momentedPointTime =
      form && form.endInfo && form.endInfo.pointTime
        ? moment(form.endInfo.pointTime, 'HH:mm:ss')
        : null;
    return (
      <React.Fragment>
        <FormItem label="Choose when to start campaign" colon={false}>
          <Row gutter={24} className="ui-radio-group-custom">
            <Radio.Group
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onChange('timeType', value);
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
                  <TimePicker
                    value={momentedPointTime}
                    use12Hours
                    onChange={this.onTimePickerChange}
                  />
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
                          {form.recurrenceType === 'daily' ? (
                            <ChooseRecurrenceDailyForm
                              endInfo={form.endInfo}
                              updateEndInfo={this.updateEndInfo}
                            />
                          ) : null}
                          {form.recurrenceType === 'weekly' ? (
                            <ChooseRecurrenceWeeklyForm
                              endInfo={form.endInfo}
                              updateEndInfo={this.updateEndInfo}
                            />
                          ) : null}
                          {form.recurrenceType === 'monthly' ? (
                            <ChooseRecurrenceMonthlyForm
                              endInfo={form.endInfo}
                              updateEndInfo={this.updateEndInfo}
                            />
                          ) : null}
                          {form.recurrenceType === 'yearly' ? (
                            <ChooseRecurrenceYearlyForm
                              endInfo={form.endInfo}
                              updateEndInfo={this.updateEndInfo}
                            />
                          ) : null}
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
                {this.renderSpecificTimeList()}
              </Col>
            </Radio.Group>
          </Row>
        </FormItem>
      </React.Fragment>
    );
  }
}
