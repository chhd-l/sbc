import React, { Component } from 'react';
import { Form, Row, Col, Radio, Input, InputNumber, Select, Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

export default class ChooseRecurrenceWeeklyForm extends Component<any, any> {
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
      endInfo: {
        checkboxValues: []
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
    const params = { checkboxValues: endInfo.checkboxValues };
    updateEndInfo(params);
  }
  render() {
    const { endInfo, weeks } = this.state;
    return (
      <React.Fragment>
        <Row gutter={24} style={{ lineHeight: 2.8 }}>
          <Col span={24}>Recur every week on</Col>
          <Col span={24}>
            <CheckboxGroup
              value={endInfo.checkboxValues}
              onChange={(checkboxValues) => {
                this.onChange('checkboxValues', checkboxValues);
              }}
            >
              <Row>
                {weeks.map((item, index) => (
                  <Col span={12} key={index}>
                    <Checkbox value={item.value}>{item.name}</Checkbox>
                  </Col>
                ))}
              </Row>
            </CheckboxGroup>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
