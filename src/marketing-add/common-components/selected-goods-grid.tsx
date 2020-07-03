import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid } from 'qmkit';
import { Table } from 'antd';

const Column = Table.Column;

import styled from 'styled-components';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;

/**
 * 商品添加
 */
export default class SelectedGoodsGrid extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      skuExists: props.skuExists
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ skuExists: nextProps.skuExists });
  }

  render() {
    const { selectedRows, deleteSelectedSku } = this.props;
    const { skuExists } = this.state;

    return (
      <TableRow>
        <DataGrid
          scroll={{ y: 500 }}
          size="small"
          rowKey={(record) => record.goodsInfoId}
          dataSource={selectedRows ? selectedRows.toJS() : []}
          pagination={false}
          rowClassName={(record) => {
            if (fromJS(skuExists).includes(record.goodsInfoId)) {
              return 'red';
            } else {
              return '';
            }
          }}
        >
          <Column
            title="SKU code"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
            width="15%"
          />

          <Column
            title="Product Name"
            dataIndex="goodsInfoName"
            key="goodsInfoName"
            width="20%"
          />

          <Column
            title="Specification"
            dataIndex="specText"
            key="specText"
            width="20%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="Category"
            key="cateName"
            dataIndex="cateName"
            width="10%"
          />

          <Column
            title="Brand"
            key="brandName"
            dataIndex="brandName"
            width="10%"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="Price"
            key="marketPrice"
            dataIndex="marketPrice"
            width="10%"
            render={(data) => {
              return `¥${data}`;
            }}
          />

          <Column
            title="Operation"
            key="operate"
            width="10%"
            render={(row) => {
              return (
                <a onClick={() => deleteSelectedSku(row.goodsInfoId)}>Delete</a>
              );
            }}
          />
        </DataGrid>
      </TableRow>
    );
  }
}
