import React, { Component } from 'react';
import { Form, Row, Col, Radio, Input, InputNumber, Select } from 'antd';

const { Option } = Select;

export default class ChooseRecurrenceMonthlyForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      weeks: [
        { name: 'Monday', value: 'Monday' },
        { name: 'Tuesday', value: 'Tuesday' },
        { name: 'Wednesday', value: 'Wednesday' },
        { name: 'Thursday', value: 'Thursday' },
        { name: 'Friday', value: 'Friday' },
        { name: 'Saturday', value: 'Saturday' },
        { name: 'Sunday', value: 'Sunday' }
      ],
      sorts: [
        { name: 'first', value: 'first' },
        { name: 'second', value: 'second' },
        { name: 'third', value: 'third' },
        { name: 'fourth', value: 'fourth' }
      ],
      endInfo: {
        radioType: '',
        whichDay: 1,
        months1: 1,
        months2: 1,
        whichOne: '',
        whichWeek: ''
      }
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    const { endInfo } = this.props;
    if (endInfo) {
      this.setState({
        endInfo: {
          radioType: endInfo.radioType,
          whichDay: endInfo.whichDay,
          months1: endInfo.radioType === '1' ? endInfo.months : '',
          months2: endInfo.radioType === '2' ? endInfo.months : '',
          whichOne: endInfo.whichOne,
          whichWeek: endInfo.whichWeek
        }
      });
    }
  }

  onChange(field, value) {
    let data = this.state.endInfo;
    data[field] = value;
    this.setState(
      {
        endInfo: data
      },
      () => this.updateParentValue()
    );
  }
  updateParentValue() {
    const { updateEndInfo } = this.props;
    const { endInfo } = this.state;
    const radioType = endInfo.radioType;
    const params = { radioType: radioType, months: '', whichDay: '', whichOne: '', whichWeek: '' };
    if (radioType == 1) {
      params.months = endInfo.months1;
      params.whichDay = endInfo.whichDay;
    } else {
      params.whichOne = endInfo.whichOne;
      params.whichWeek = endInfo.whichWeek;
      params.months = endInfo.months2;
    }
    updateEndInfo(params);
  }
  render() {
    const { weeks, sorts, endInfo } = this.state;
    return (
      <React.Fragment>
        <Radio.Group
          onChange={(e) => {
            const value = (e.target as any).value;
            this.onChange('radioType', value);
          }}
          value={endInfo.radioType}
          className="ui-radio-group-custom"
        >
          <Radio value="1">
            <Row gutter={24} type="flex" justify="start" align="middle">
              <Col span={4}>Day</Col>
              <Col span={8}>
                <InputNumber
                  onChange={(value) => {
                    this.onChange('radioType', '1');
                    this.onChange('whichDay', value);
                  }}
                  value={endInfo.whichDay}
                  min={1}
                  max={31}
                  size="small"
                  defaultValue={1}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6} pull={1}>
                of every
              </Col>
              <Col span={8} push={1}>
                <InputNumber
                  onChange={(value) => {
                    this.onChange('radioType', '1');
                    this.onChange('months1', value);
                  }}
                  value={endInfo.months1}
                  min={1}
                  max={100}
                  size="small"
                  defaultValue={1}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>Months</Col>
            </Row>
          </Radio>
          <Radio value="2">
            <Row gutter={24} type="flex" justify="start" align="middle">
              <Col span={4}>The</Col>
              <Col span={9}>
                <Select
                  allowClear
                  dropdownClassName="minSelect"
                  onChange={(value) => {
                    this.onChange('radioType', '2');
                    this.onChange('whichOne', value);
                  }}
                  value={endInfo.whichOne}
                  size="small"
                >
                  {sorts.map((item, index) => (
                    <Option value={item.value} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={11}>
                <Select
                  allowClear
                  dropdownClassName="minSelect"
                  onChange={(value) => {
                    this.onChange('radioType', '2');
                    this.onChange('whichWeek', value);
                  }}
                  value={endInfo.whichWeek}
                  size="small"
                >
                  {weeks.map((item, index) => (
                    <Option value={item.value} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>of every</Col>
              <Col span={8}>
                <InputNumber
                  onChange={(value) => {
                    this.onChange('radioType', '2');
                    this.onChange('months2', value);
                  }}
                  value={endInfo.months2}
                  min={1}
                  max={12}
                  defaultValue={1}
                  size="small"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6} pull={1}>
                Months
              </Col>
            </Row>
          </Radio>
        </Radio.Group>
      </React.Fragment>
    );
  }
}
