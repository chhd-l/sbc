import React, { Component } from 'react';
import { Form, Row, Col, Radio, Input, InputNumber } from 'antd';

export default class ChooseRecurrenceDailyForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }
  onChange(value) {
    const { updateValue } = this.props;
    updateValue('eventType', value);
  }
  render() {
    return (
      <React.Fragment>
        <Radio.Group v-model="form.radioType" className="ui-radio-group-custom">
          <Radio value="1">
            <Row gutter={2} type="flex" justify="start" align="middle">
              <Col span={5}>Every</Col>
              <Col span={9}>
                <InputNumber min={1} max={1000} size="small" v-model="form.days" style={{ width: '80%' }} />
              </Col>
              <Col span={6} pull={1}>
                Days
              </Col>
            </Row>
          </Radio>
          <Radio value="2">Every weekday</Radio>
        </Radio.Group>
      </React.Fragment>
    );
  }
}
