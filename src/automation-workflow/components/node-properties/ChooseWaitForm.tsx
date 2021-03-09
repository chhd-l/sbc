import React, { Component } from 'react';
import { Form, Row, Col, Input, Radio, TimePicker, DatePicker, InputNumber, Select } from 'antd';
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
      }
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    const { form } = this.props;
    if (form) {
      this.setState({
        form: {
          radioType: form.radioType,
          whichDay: form.whichDay,
          months1: form.radioType === '1' ? form.months : '',
          months2: form.radioType === '2' ? form.months : '',
          whichOne: form.whichOne,
          whichWeek: form.whichWeek
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
    const { updateform } = this.props;
    const { form } = this.state;
    const params = {};
    updateform(params);
  }
  render() {
    const { form, timeTypes } = this.state;
    return (
      <React.Fragment>
        <FormItem label="Choose how long should be waited" colon={false}>
          <Row gutter={24}>
            <Radio.Group
              value="form.atSpecialTime"
              onChange={(value) => {
                this.onChange('atSpecialTime', value);
              }}
            >
              <Col span={24}>
                <Radio value={true}>Wait for a set amount of time</Radio>
              </Col>
              <Col span={24}>
                <Row gutter={16}>
                  <Col span={6}>
                    <InputNumber min={0} placeholder="Number" value={form.timeAmountValue} disabled={form.atSpecialTime} size="small" style={{ fontSize: '10px' }} />
                  </Col>
                  <Col span={8}>
                    <Select value="form.timeAmountType" disabled={!form.atSpecialTime} size="small" style={{ fontSize: '10px' }} dropdownStyle={{ fontSize: '10px' }}>
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
                <Radio value={false}>Wait until a specific date and time</Radio>
              </Col>
              <Col span={24}>
                <Row gutter={10}>
                  <Col span={11}>
                    <DatePicker value={form.specialDate} disabled={form.atSpecialTime} size="small" style={{ fontSize: '10px' }} />
                  </Col>
                  <Col span={13}>
                    <Row gutter={2}>
                      <Col span={8}>
                        <InputNumber placeholder="Hours" min={0} max={12} value={form.specialHours} disabled={form.atSpecialTime} size="small" style={{ fontSize: '10px', width: '65px' }} />
                      </Col>
                      <Col span={1}>
                        <span>:</span>
                      </Col>
                      <Col span={8}>
                        <InputNumber placeholder="Minutes" min={0} max={59} value={form.specialMins} disabled={form.atSpecialTime} size="small" style={{ fontSize: '10px', width: '65px' }} />
                      </Col>
                      <Col span={7}>
                        <Select value={form.specialAm} disabled={form.atSpecialTime} size="small" style={{ fontSize: '10px' }} dropdownstyle={{ fontSize: '10px' }}>
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
