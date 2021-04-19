import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Input, Form, Icon, Button } from 'antd';
import { AuthWrapper, Const, noop } from 'qmkit';
import { Relax } from 'plume2';
import { FormattedMessage, injectIntl } from 'react-intl';
const { RangePicker } = DatePicker;
const { Search } = Input;

@Relax
export default class ListSearchForm extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  props: {
    relaxProps?: {
      handleBatchExport: Function;
      getDate: any;
      skuText: any;
      onProductReportPage: Function;
      onProductStatistics: Function;
      fieldOnChange: Function;
    };
  };

  static relaxProps = {
    handleBatchExport: noop,
    getDate: 'getDate',
    skuText: 'skuText',
    onProductReportPage: noop,
    onProductStatistics: noop,
    fieldOnChange: noop
  };

  componentDidMount() {}

  sukOnChange(e) {
    const value = e.target.value;
    const { fieldOnChange } = this.props.relaxProps
    fieldOnChange({
      field: 'skuText',
      value
    })
  }
  onSearch() {
    const {onProductReportPage, onProductStatistics } = this.props.relaxProps;
    onProductStatistics();
    onProductReportPage()
  }

  render() {
    // const { skuText } = this.state;
    const { handleBatchExport, getDate, skuText } = this.props.relaxProps;
    return (
      <div className="list-head-container">
        <h4>
          <FormattedMessage id="Analysis.ProductReport" />
        </h4>
        <div>
          <Form layout="inline">
            <Form.Item>
              <Search placeholder="Search single SKU" style={{ width: 200 }} value={skuText} onChange={(e) => this.sukOnChange(e)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" shape="round" onClick={() => this.onSearch()}>
                <FormattedMessage id="Analysis.Search" />
              </Button>
            </Form.Item>
            <Form.Item>
              <AuthWrapper functionName="f_export_product_data">
                <Button type="primary" shape="round" onClick={() => handleBatchExport()}>
                  <FormattedMessage id="Analysis.DownloadTheReport" />
                </Button>
              </AuthWrapper>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
