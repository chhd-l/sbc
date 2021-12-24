import React, { Component } from 'react';
import { Form, Row, Col, Input, Radio, TimePicker, DatePicker, InputNumber, Select } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

export default class ChooseWaitForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      timeTypes: [
        { name: 'Minutes', value: 'Minutes' },
        { name: 'Hours', value: 'Hours' },
        { name: 'Days', value: 'Days' },
        { name: 'Weeks', value: 'Weeks' },
        { name: 'Months', value: 'Months' }
      ],
      form: {
        atSpecialTime: false,
        specialDate: null,
        specialHours: 0,
        specialMins: 0,
        specialAm: 'AM',
        timeAmountType: 'days',
        timeAmountValue: 0
      },
      nodeId: ''
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.initData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps);
  }

  initData(nextProps) {
    const { waitCampaignTime } = nextProps;
    const { form, nodeId } = this.state;
    if (nodeId === nextProps.nodeId) {
      return;
    } else {
      this.setState({
        nodeId: nextProps.nodeId
      });
    }

    if (waitCampaignTime) {
      if (waitCampaignTime.atSpecialTime === undefined) {
        this.setState({
          form: {
            atSpecialTime: false,
            specialDate: null,
            specialHours: 0,
            specialMins: 0,
            specialAm: 'AM',
            timeAmountType: 'days',
            timeAmountValue: 0
          }
        });
      } else {
        form.atSpecialTime = waitCampaignTime.atSpecialTime;
        form.timeAmountType = waitCampaignTime.timeAmountType;
        form.timeAmountValue = waitCampaignTime.timeAmountValue;
        if (waitCampaignTime.specialTime) {
          let dateArray = waitCampaignTime.specialTime.split(' ');
          let date = dateArray[0];
          form.specialDate = moment(date);
          let time = dateArray[1];
          if (time) {
            let timeArray = time.split(':');
            form.specialHours = parseInt(timeArray[0]) > 12 ? parseInt(timeArray[0]) - 12 : parseInt(timeArray[0]);
            form.specialMins = timeArray[1];
            form.specialAm = parseInt(timeArray[0]) >= 12 ? 'PM' : 'AM';
          }
        } else {
          form.specialDate = null;
          form.specialHours = 0;
          form.specialMins = 0;
          form.specialAm = 'AM';
        }
        this.setState({
          form: form
        });
      }
    }
  }
  onChange(field, value) {
    let data = this.state.form;
    data[field] = value;
    if (field === 'atSpecialTime') {
      this.setState(
        {
          form: {
            atSpecialTime: value,
            specialDate: null,
            specialHours: 0,
            specialMins: 0,
            specialAm: 'AM',
            timeAmountType: 'days',
            timeAmountValue: 0
          }
        },
        () => this.updateParentValue()
      );
    } else {
      this.setState(
        {
          form: data
        },
        () => this.updateParentValue()
      );
    }
  }

  getSpecialDate() {
    const { form } = this.state;
    if (form.specialDate === null) {
      return '';
    }
    let dateTimeString = form.specialDate + ' ' + form.specialHours + ':' + form.specialMins + ' ' + form.specialAm;
    let dateTime = new Date(dateTimeString);
    let datetimeFormat = moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
    return datetimeFormat;
  }

  updateParentValue() {
    const { updateValue } = this.props;
    const { form } = this.state;
    const data = {
      atSpecialTime: form.atSpecialTime,
      specialTime: this.getSpecialDate(),
      timeAmountValue: form.timeAmountValue,
      timeAmountType: form.timeAmountType,
      totalMinutes: 0
    };
    switch (form.timeAmountType) {
      case 'Minutes':
        data.totalMinutes = form.timeAmountValue;
        break;
      case 'Hours':
        data.totalMinutes = form.timeAmountValue * 60;
        break;
      case 'Days':
        data.totalMinutes = form.timeAmountValue * 60 * 24;
        break;
      case 'Weeks':
        data.totalMinutes = form.timeAmountValue * 60 * 24 * 7;
        break;
      case 'Months':
        data.totalMinutes = form.timeAmountValue * 60 * 24 * 30;
        break;
    }
    updateValue('waitCampaignTime', data);
  }
  render() {
    const { form, timeTypes } = this.state;
    return (
      <React.Fragment>
        <FormItem label="Choose how long should be waited" colon={false}>
          <Row gutter={24}>
            <Radio.Group
              value={form.atSpecialTime}
              onChange={(e) => {
                const value = (e.target as any).value;
                this.onChange('atSpecialTime', value);
              }}
            >
              <Col span={24}>
                <Radio value={false}>Wait for a set amount of time</Radio>
              </Col>
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={6}>
                    <InputNumber
                      onChange={(value) => {
                        this.onChange('timeAmountValue', value);
                      }}
                      min={0}
                      placeholder="Number"
                      value={form.timeAmountValue}
                      disabled={form.atSpecialTime}
                      size="small"
                      style={{ fontSize: '10px' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Select
                      allowClear
                      dropdownClassName="minSelect"
                      onChange={(value) => {
                        this.onChange('timeAmountType', value);
                      }}
                      value={form.timeAmountType}
                      disabled={form.atSpecialTime}
                      size="small"
                      style={{ fontSize: '10px' }}
                    >
                      {timeTypes.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Radio value={true}>Wait until a specific date and time</Radio>
              </Col>
              <Col span={24}>
                <Row gutter={10}>
                  <Col span={11}>
                    <DatePicker
                      onChange={(value, dateString) => {
                        this.onChange('specialDate', dateString);
                      }}
                      format="YYYY-MM-DD"
                      value={form.specialDate ? moment(form.specialDate) : null}
                      disabled={!form.atSpecialTime}
                      size="small"
                      style={{ fontSize: '10px' }}
                    />
                  </Col>
                  <Col span={13}>
                    <Row gutter={2}>
                      <Col span={8}>
                        <InputNumber
                          onChange={(value) => {
                            this.onChange('specialHours', value);
                          }}
                          placeholder="Hours"
                          min={0}
                          max={12}
                          value={form.specialHours}
                          disabled={!form.specialDate}
                          size="small"
                          style={{ fontSize: '10px', width: '65px' }}
                        />
                      </Col>
                      <Col span={1}>
                        <span>:</span>
                      </Col>
                      <Col span={8}>
                        <InputNumber
                          onChange={(value) => {
                            this.onChange('specialMins', value);
                          }}
                          placeholder="Minutes"
                          min={0}
                          max={59}
                          value={form.specialMins}
                          disabled={!form.specialDate}
                          size="small"
                          style={{ fontSize: '10px', width: '65px' }}
                        />
                      </Col>
                      <Col span={7}>
                        <Select
                          allowClear
                          dropdownClassName="minSelect"
                          onChange={(value) => {
                            this.onChange('specialAm', value);
                          }}
                          value={form.specialAm}
                          disabled={!form.specialDate}
                          size="small"
                          style={{ fontSize: '10px' }}
                          dropdownStyle={{ fontSize: '10px' }}
                        >
                          <Option value="AM" key="AM">
                            AM
                          </Option>
                          <Option value="PM" key="PM">
                            PM
                          </Option>
                        </Select>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Radio.Group>
          </Row>
        </FormItem>
      </React.Fragment>
    );
  }
}
