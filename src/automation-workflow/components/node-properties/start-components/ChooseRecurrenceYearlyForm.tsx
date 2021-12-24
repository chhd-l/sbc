import React, { Component } from 'react';
import { Row, Col, Radio, Input, InputNumber, Select, Checkbox } from 'antd';

const { Option } = Select;
export default class ChooseRecurrenceYearlyendInfo extends Component<any, any> {
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
      months: [
        { name: 'April', value: 'April' },
        { name: 'August', value: 'August' },
        { name: 'December', value: 'December' },
        { name: 'February', value: 'February' },
        { name: 'January', value: 'January' },
        { name: 'July', value: 'July' },
        { name: 'June', value: 'June' },
        { name: 'March', value: 'March' },
        { name: 'May', value: 'May' },
        { name: 'November', value: 'November' },
        { name: 'October', value: 'October' },
        { name: 'September', value: 'September' }
      ],
      endInfo: {
        radioType: '',
        years: 1,
        whichMonth1: '',
        whichMonth2: '',
        whichDay: '',
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
          years: endInfo.years,
          whichMonth1: endInfo.radioType === '1' ? endInfo.whichMonth : '',
          whichMonth2: endInfo.radioType === '2' ? endInfo.whichMonth : '',
          whichDay: endInfo.whichDay,
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
    const params = { radioType: radioType, years: endInfo.years, whichMonth: '', whichDay: '', whichOne: '', whichWeek: '' };
    if (radioType == 1) {
      params.whichMonth = endInfo.whichMonth1;
      params.whichDay = endInfo.whichDay;
    } else {
      params.whichMonth = endInfo.whichMonth2;
      params.whichOne = endInfo.whichOne;
      params.whichWeek = endInfo.whichWeek;
    }
    updateEndInfo(params);
  }
  render() {
    const { weeks, sorts, months, endInfo } = this.state;
    return (
      <React.Fragment>
        <Row gutter={24} style={{ lineHeight: 2.8 }}>
          <Col span={24}>
            Recur every &nbsp;&nbsp;
            <InputNumber min={1} max={100} size="small" value={endInfo.years} className="ui-input-number-custom" />
            &nbsp;&nbsp;year(s)
          </Col>
          <Col span={23} push={1}>
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
                  <Col span={4}>On</Col>
                  <Col span={11}>
                    <Select
                      allowClear
                      dropdownClassName="minSelect"
                      onChange={(value) => {
                        this.onChange('radioType', '1');
                        this.onChange('whichMonth1', value);
                      }}
                      size="small"
                      value={endInfo.whichMonth1}
                    >
                      {months.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={9}>
                    <InputNumber
                      onChange={(value) => {
                        this.onChange('radioType', '1');
                        this.onChange('whichDay', value);
                      }}
                      min={1}
                      max={31}
                      size="small"
                      value={endInfo.whichDay}
                      style={{ width: '80%' }}
                    />
                  </Col>
                </Row>
              </Radio>
              <Radio value="2">
                <Row gutter={24} type="flex" justify="start" align="middle">
                  <Col span={6}>On the</Col>
                  <Col span={13}>
                    <Select
                      allowClear
                      dropdownClassName="minSelect"
                      onChange={(value) => {
                        this.onChange('radioType', '2');
                        this.onChange('whichMonth2', value);
                      }}
                      size="small"
                      value={endInfo.whichMonth2}
                    >
                      {months.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={5}></Col>
                  <Col span={11}>
                    <Select
                      allowClear
                      dropdownClassName="minSelect"
                      onChange={(value) => {
                        this.onChange('radioType', '2');
                        this.onChange('whichOne', value);
                      }}
                      size="small"
                      value={endInfo.whichOne}
                    >
                      {sorts.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={12}>
                    <Select
                      allowClear
                      dropdownClassName="minSelect"
                      onChange={(value) => {
                        this.onChange('radioType', '2');
                        this.onChange('whichWeek', value);
                      }}
                      size="small"
                      value={endInfo.whichWeek}
                    >
                      {weeks.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
