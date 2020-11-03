import React, { Component } from 'react';
import ListSearchForm from './list-search-form';
import ReportList from './report-list';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

@Relax
export default class ProductReportList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  props: {
    relaxProps?: {
      loading: boolean;
      productReportPage: any;
      onProductReportPage: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    productReportPage: 'productReportPage',
    onProductReportPage: noop
  };

  componentDidMount() {}
  onSearch(params) {
    const { onProductReportPage } = this.props.relaxProps;
    onProductReportPage(params);
  }

  render() {
    return (
      <div className="container">
        <ListSearchForm onSearch={(params) => this.onSearch(params)} />
        <ReportList />
      </div>
    );
  }
}
