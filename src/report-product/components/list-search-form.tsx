import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Input, Form, Icon, Button } from 'antd';
import { Const } from 'qmkit';
const { RangePicker } = DatePicker;
const { Search } = Input;
export default class ListSearchForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      beginTime: '',
      endTime: ''
    };
  }

  componentDidMount() {}
  datePickerChange(e) {
    let beginTime = '';
    let endTime = '';
    if (e.length > 0) {
      beginTime = e[0].format(Const.DAY_FORMAT);
      endTime = e[1].format(Const.DAY_FORMAT);
    }
    this.setState({
      beginTime,
      endTime
    });
  }
  render() {
    return (
      <div className="list-head-container">
        <h4>Product Report</h4>
        <div>
          <Form layout="inline">
            <Form.Item>
              <RangePicker size="default" onChange={(e) => this.datePickerChange(e)} />
            </Form.Item>
            <Form.Item>
              <Search placeholder="input search text" onSearch={(value) => console.log(value)} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" shape="round">
                Search
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" shape="round">
                Download the report
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
