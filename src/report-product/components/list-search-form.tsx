import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Input, Form, Icon, Button } from 'antd';
import { AuthWrapper, Const, noop } from 'qmkit';
import { Relax } from 'plume2';
const { RangePicker } = DatePicker;
const { Search } = Input;

@Relax
export default class ListSearchForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      beginDate: '',
      endDate: '',
      skuText: ''
    };
  }
  props: {
    relaxProps?: {
      handleBatchExport: Function;
      getDate: any;
    };
  };

  static relaxProps = {
    handleBatchExport: noop,
    getDate: 'getDate'
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
      beginDate: beginTime,
      endDate: endTime
    });
  }
  sukOnChange(e) {
    const value = e.target.value;
    this.setState({
      skuText: value
    });
  }
  onSearch() {
    const { skuText } = this.state;
    const { getDate } = this.props.relaxProps;
    const params = {
      beginDate: getDate.beginDate,
      endDate: getDate.endDate,
      skuCode: skuText,
      pageNum: 1,
      pageSize: 10,
      sortName: 'revenue'
    };
    this.props.onSearch(params);
  }

  render() {
    const { skuText } = this.state;
    const { handleBatchExport, getDate } = this.props.relaxProps;
    return (
      <div className="list-head-container">
        <h4>Product Report</h4>
        <div>
          <Form layout="inline">
            <Form.Item>
              <Search placeholder="Search single SKU" style={{ width: 200 }} value={skuText} onChange={(e) => this.sukOnChange(e)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" shape="round" onClick={() => this.onSearch()}>
                Search
              </Button>
            </Form.Item>
            <Form.Item>
              <AuthWrapper functionName="f_export_product_data">
                <Button type="primary" shape="round" onClick={() => handleBatchExport()}>
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
