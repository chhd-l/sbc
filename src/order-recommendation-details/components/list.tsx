import * as React from 'react';
import { fromJS } from 'immutable';

import { DataGrid, cache } from 'qmkit';
import { Table } from 'antd';

const Column = Table.Column;

import styled from 'styled-components';
const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
    height: 500px;
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

  UNSAFE_componentWillReceiveProps(nextProps) {
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
            title="Recommendation No"
            dataIndex="goodsInfoNo"
            key="goodsInfoNo"
          />

          <Column title="Image" dataIndex="goodsInfoName" key="goodsInfoName" />

          <Column
            title="Product Name"
            dataIndex="specText"
            key="specText"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column title="SKU" key="cateName" dataIndex="cateName" />

          <Column
            title="Member Price"
            key="brandName"
            dataIndex="brandName"
            render={(value) => {
              if (value) {
                return value;
              } else {
                return '-';
              }
            }}
          />

          <Column
            title="Member Price"
            key="marketPrice"
            dataIndex="marketPrice"
            render={(data) => {
              return `${
                sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) + data
              }`;
            }}
          />
          <Column title="Quantily" key="cateName" dataIndex="cateName" />
          <Column
            title="Operation"
            key="operate"
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
