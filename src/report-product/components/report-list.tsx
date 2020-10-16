import React, { Component } from 'react';
import { Table } from 'antd';
import * as webapi from '../webapi';

export default class ReportList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      list: [],
      columns: []
    };
  }

  componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
    this.setState({
      list: nextProps.list,
      columns: nextProps.columns
    });
  }
  componentDidMount() {
    webapi.getAllProductList().then((res) => {
      this.setState({
        loading: false
      });
    });
  }

  render() {
    const { loading, list, columns } = this.state;
    return (
      <div>
        <Table dataSource={list} columns={columns} loading={loading} />;
      </div>
    );
  }
}
