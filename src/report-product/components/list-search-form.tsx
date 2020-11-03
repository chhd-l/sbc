import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Input, Form, Icon, Button } from 'antd';
import {AuthWrapper, Const, noop} from 'qmkit';
import {Relax} from "plume2";
const { RangePicker } = DatePicker;
const { Search } = Input;

@Relax
export default class ListSearchForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      beginTime: '',
      endTime: '',
      skuText: ''
    };
  }
  props: {
    relaxProps?: {
      handleBatchExport: Function;
    };
  };

  static relaxProps = {
    handleBatchExport: noop
  };

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
  sukOnChange(e) {
    const value = e.target.value;
    this.setState({
      skuText: value
    });
  }
  onSearch() {
    const { beginTime, endTime, skuText } = this.state;
    const params = {
      beginTime,
      endTime,
      skuText
    };
    this.props.onSearch(params);
  }

  render() {
    const { skuText } = this.state;
    return (
      <div className="list-head-container">
        <h4>Product Report</h4>
        <div>
          <Form layout="inline">
            <Form.Item>
              <RangePicker size="default" onChange={(e) => this.datePickerChange(e)} />
            </Form.Item>
            <Form.Item>
              <Search placeholder="Search single SKU" style={{ width: 200 }} value={skuText} onChange={(e) => this.sukOnChange(e)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" shape="round" onClick={() => this.onSearch()}>
                Search
              </Button>
            </Form.Item>
            <Form.Item>
              <AuthWrapper functionName="digital_trategy_export">
                <Button type="primary" shape="round" onClick={() => this._handleBatchExport()}>
                  Download the report
                </Button>
              </AuthWrapper>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
