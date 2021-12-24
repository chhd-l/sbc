import React, { Component } from 'react';
import { Table } from 'antd';

export default class Tab extends Component<any, any> {
  static defaultProps = {
    loading: false
  };

  constructor(props: any) {
    super(props);
  }

  onChange = (pagination) => {
    const { onChange } = this.props;
    const newPage = Object.assign({},pagination)
    onChange(Object.assign(pagination,{ 'pageNum': --newPage.current }));
  };

  render() {
    return (
      <Table
        {...this.props}
        onChange={this.onChange}
        loading={this.props.loading}
        style={{ paddingRight: 20 }}
        scroll={{ x: '100%' }}
      />
    );
  }
}
