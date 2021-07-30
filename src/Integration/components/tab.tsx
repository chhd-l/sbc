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
        loading={{ spinning: this.props.loading,
          indicator: <img className="spinner"
                          src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif"
                          style={{ width: '90px', height: '90px' }} alt="" />
        }}
        style={{ paddingRight: 20 }}
        scroll={{ x: '100%' }}
      />
    );
  }
}
