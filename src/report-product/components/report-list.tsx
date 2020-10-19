import React, { Component } from 'react';
import { Table } from 'antd';
export default class ReportList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
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
  componentDidMount() {}

  render() {
    const { list, columns } = this.state;
    return (
      <div>
        <Table dataSource={list} columns={columns} loading={this.props.loading} />;
      </div>
    );
  }
}
