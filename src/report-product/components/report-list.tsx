import React, { Component } from 'react';
import { Table, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { cache, DataGrid, FindArea, noop } from 'qmkit';
import { Relax } from 'plume2';

const Column = DataGrid;

@Relax
export default class ReportList extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      columns: [],
      selectedRowKeys: []
    };
  }
  props: {
    relaxProps?: {
      onProductReportPage: Function;
      total: number;
      pageSize: number;
      current: number;
      productReportPage: any;
      loading: boolean;
    };
  };

  static relaxProps = {
    onProductReportPage: noop,
    total: 'total',
    pageSize: 'pageSize',
    current: 'current',
    productReportPage: 'productReportPage',
    loading: 'loading'
  };

  componentDidMount() {}

  render() {
    const { onProductReportPage, total, pageSize, current, productReportPage, loading } = this.props.relaxProps;
    return (
      <div>
        <DataGrid
          loading={loading}
          rowKey="serialNum"
          pagination={{
            pageSize,
            total,
            current: current,
            onChange: (pageNum, pageSize) => {
              onProductReportPage({ pageNum: pageNum - 1, pageSize });
            }
          }}
          dataSource={productReportPage && productReportPage}
        >
          <Column title="No" key="serialNum" dataIndex="serialNum" width="5%" />
          <Column title="Product" key="skuName" dataIndex="skuName" width="200px" />
          <Column title="SKU" key="SKU" dataIndex="skuCode" />
          <Column title="skuCode" key="salesVolume" dataIndex="salesVolume" />
          <Column title="Revenue" dataIndex="revenue" key="revenue" />

          <Column
            title="Rating"
            dataIndex="Rating"
            key="Rating"
            render={(rowData) => {
              return rowData ? rowData : '--';
            }}
          />
        </DataGrid>
        {/*<Table rowSelection={rowSelection} dataSource={list} columns={columns} loading={this.props.loading} />;*/}
      </div>
    );
  }
}