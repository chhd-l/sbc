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
      ]
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(value) {
    const { updateValue } = this.props;
    updateValue('eventType', value);
  }
  render() {
    const { weeks, sorts } = this.state;
    return (
      <React.Fragment>
        <Radio.Group v-model="form.radioType" className="ui-radio-group-custom">
          <Radio value="1">
            <Row gutter={24} type="flex" justify="start" align="middle">
              <Col span={4}>Day</Col>
              <Col span={8}>
                <InputNumber min={1} max={31} size="small" defaultValue={1} v-model="form.whichDay" style={{ width: '100%' }} />
              </Col>
              <Col span={6} pull={1}>
                of every
              </Col>
              <Col span={8} push={1}>
                <InputNumber min={1} max={100} size="small" defaultValue={1} v-model="form.months1" style={{ width: '100%' }} />
              </Col>
              <Col span={6}>Months</Col>
            </Row>
          </Radio>
          <Radio value="2">
            <Row gutter={24} type="flex" justify="start" align="middle">
              <Col span={4}>The</Col>
              <Col span={9}>
                <Select v-model="form.whichOne" size="small">
                  {sorts.map((item, index) => (
                    <Option value={item.value} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={11}>
                <Select v-model="form.whichWeek" size="small">
                  {weeks.map((item, index) => (
                    <Option value={item.value} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>of every</Col>
              <Col span={8}>
                <InputNumber min={1} max={12} defaultValue={1} size="small" v-model="form.months2" style={{ width: '100%' }} />
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
