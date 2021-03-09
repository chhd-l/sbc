import React, { Component } from 'react';
import { endInfo, Row, Col, Radio, Input, InputNumber } from 'antd';

export default class ChooseRecurrenceDailyendInfo extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      endInfo: {
        radioType: '',
        days: 1
      }
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    const { endInfo } = this.props;
    if (endInfo) {
      this.setState({
        endInfo: endInfo
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
    const params = { radioType: endInfo.radioType, days: 1 };
    if (endInfo.radioType === '1') {
      params.days = endInfo.days;
    }
    updateEndInfo(params);
  }

  render() {
    const { endInfo } = this.state;
    return (
      <React.Fragment>
        <Radio.Group
          onChange={(e) => {
            const value = (e.target as any).value;
            this.onChange('radioType', value);
            if (value !== '1') {
              this.onChange('days', 1);
            }
          }}
          value={endInfo.radioType}
          className="ui-radio-group-custom"
        >
          <Radio value="1">
            <Row gutter={2} type="flex" justify="start" align="middle">
              <Col span={5}>Every</Col>
              <Col span={9}>
                <InputNumber
                  onChange={(value) => {
                    this.onChange('radioType', '1');
                    this.onChange('days', value);
                  }}
                  value={endInfo.days}
                  min={1}
                  max={1000}
                  size="small"
                  style={{ width: '80%' }}
                />
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
